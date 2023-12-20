import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
// import { Message, Room } from './entities/message.entity';
import {
  CreateDirectMessageDto,
  CreateMessageDto,
  CreateRoomDto,
  Data,
  JoinRoomDto,
} from './dto/create-message.dto';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { RoomType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}
  async handleConnection(client: Socket, data: Data) {
    console.log('connected');
    console.log(data);
    console.log(client.id);
    // const user = await this.prisma.user.findUnique({
    //   where: {
    //     username : data.username,
    //   },
    //   include: {
    //     rooms: true,
    //   },
    // });
    // if (!user) {
    //   throw new Error('User not found');
    // }
    // if(user.rooms.length !== 0){
    //   user.rooms.forEach((room) => {
    //     client.join(room.id.toString());
    //   });
    // }
  }
  // async get_blocked_users(username: string) {}
  async createMessage(client: Socket, createMessageDto: CreateMessageDto) {
    if (!(await this.identifyUser(createMessageDto))) {
      throw new Error('User does not have access to this room');
    }
    const user = await this.usersService.findOneByUsername(
      createMessageDto.username,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        roomId: createMessageDto.roomId,
        userId: user.oauthId,
      },
    });
    const roomUsers = await this.prisma.roomUser.findMany({
      where: {
        roomId: createMessageDto.roomId,
      },
      include: {
        user: { include: { blocks: true } },
      },
    });
    // for each one of the users in the room check if the sender is blocked or not and emit to non blocked users
    roomUsers.forEach((user) => {
      client.to(user.user.socketId).emit('message', message);
    });
    // client.on('message', async (message, roomId) => {
    //   const room = await this.prisma.room.findUnique({
    //     where: {
    //       id: roomId,
    //     },
    //     include: {
    //       roomuser: true,
    //     },
    //   });
    //   if (!room) {
    //     throw new Error('Room not found');
    //   }
    //   const roomUsers = room.roomuser;
    //   roomUsers.forEach((user) => {
    //     client.to(user.userId.toString()).emit('message', message);
    //   });
    // });
  }

  async identifyUser(createMessageDto: CreateMessageDto): Promise<boolean> {
    const user = await this.usersService.findOneByUsername(
      createMessageDto.username,
    );
    const room = await this.prisma.room.findUnique({
      where: {
        id: createMessageDto.roomId,
      },
    });
    if (!room || !user) {
      return false;
    }
    const isUserInRoom = await this.prisma.roomUser.findMany({
      where: {
        roomId: createMessageDto.roomId,
        userId: user.oauthId,
      },
    });

    return !!isUserInRoom;
  }
  // async identifyTypeRoom(@MessageBody() createRoomDto: CreateRoomDto
  // , id: number): Promise<boolean> {
  // if (!createRoomDto.roomType || createRoomDto.roomType === ''
  //   || await this.prisma.room.findUnique({
  //     where: {
  //       id: id
  //     }
  //   })) {
  //   return false;
  // }
  // if (createRoomDto.roomType === 'public') {
  //   await this.prisma.room.update({
  //     where: {
  //       id: id
  //     },
  //     data: {
  //       type: RoomType[createRoomDto.roomType.toUpperCase()]
  //     }
  //   });
  //   return true;
  // }
  // else if (createRoomDto.roomType === 'private') {
  //   await this.prisma.room.update({
  //     where: {
  //       id: id
  //     },
  //     data: {
  //       type: RoomType[createRoomDto.roomType.toUpperCase()]
  //     }
  //   });
  //   return true;
  // }
  // else if (createRoomDto.roomType === 'protected') {
  //   if (!createRoomDto.roomPassword || createRoomDto.roomPassword === '') {
  //     return false;
  //   }
  //   await this.prisma.room.update({
  //     where: {
  //       id: id
  //     },
  //     data: {
  //       hashedPass: await bcrypt.hash(createRoomDto.roomPassword, 10),
  //       type: RoomType[createRoomDto.roomType.toUpperCase()]
  //     }
  //   });
  //   return true;
  // }
  // else {
  //   return false;
  // }
  // }

  async directMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() direct: CreateDirectMessageDto,
  ) {
    // use this function directly after accept friend request
    const user_1 = await this.usersService.findOneByUsername(direct.username);
    const user_2 = await this.usersService.findOneByUsername(
      direct.username_target,
    );
    if (!user_1 || !user_2) {
      throw new Error('User not found');
    }
    const existingRoom = await this.prisma.room.findFirst({
      where: {
        AND: [
          { roomuser: { some: { userId: user_1.oauthId } } },
          { roomuser: { some: { userId: user_2.oauthId } } },
          { type: RoomType['DIRECT_MESSAGE'] },
        ],
      },
    });
    if (existingRoom) {
      client.join(existingRoom.id.toString());
      return existingRoom;
    }
    const room = await this.prisma.room.create({
      data: {
        name: 'direct_message' + user_1.username + user_2.username,
        type: RoomType['DIRECT_MESSAGE'],
        ownerId: user_1.oauthId,
        roomuser: {
          create: [{ userId: user_1.oauthId }, { userId: user_2.oauthId }],
        },
      },
    });
    client.join(room.id.toString());
    return room;
  }
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: CreateRoomDto,
  ) {
    const user = await this.usersService.findOneByUsername(
      createRoomDto.userName,
    );
    if (!user) {
      throw new Error('User not found');
    }
    const types = ['public', 'private', 'protected'];
    if (!types.includes(createRoomDto.roomType)) {
      throw new Error('Room type not correct');
    }
    const room = await this.prisma.room.create({
      data: {
        name: createRoomDto.roomName,
        ownerId: user.oauthId,
        type: RoomType[createRoomDto.roomType.toUpperCase()],
      },
    });
    if (createRoomDto.roomType === 'protected') {
      if (!createRoomDto.roomPassword || createRoomDto.roomPassword === '') {
        throw new Error('Room password empty');
      }
      await this.prisma.room.update({
        where: {
          id: room.id,
        },
        data: {
          hashedPass: await bcrypt.hash(createRoomDto.roomPassword, 10),
        },
      });
    }

    // if (!(await this.identifyTypeRoom(createRoomDto, room.id))) {
    //   await this.prisma.room.delete({
    //     where: {
    //       id: room.id,
    //     },
    //   });
    //   throw new Error('Room type not correct');
    // }
    await this.prisma.roomUser.create({
      data: {
        roomId: room.id,
        userId: user.oauthId,
      },
    });

    client.join(room.id.toString());
    return room;
  }

  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: JoinRoomDto,
  ) {
    const user = await this.usersService.findOneByUsername(
      createRoomDto.username,
    );
    const room_ = await this.prisma.room.findUnique({
      where: {
        id: createRoomDto.roomId,
      },
      include: {
        roomuser: true,
      },
    });
    if (!room_ || !user) {
      throw new Error('User or Room not found');
    }
    if (room_.type === RoomType['DIRECT_MESSAGE']) {
      throw new Error(
        'you dont have access to this direct message , ghayrha ya 7abibi',
      );
    }
    if (room_.roomuser.some((roomuser) => roomuser.userId === user.oauthId)) {
      console.log(user);
      // console.log('User already in room');
      throw new Error('User already in room');
    }

    await this.prisma.roomUser.create({
      data: {
        roomId: createRoomDto.roomId,
        userId: user.oauthId,
      },
    });
    // client.join(room.id.toString());
    return true;
  }

  async findRoomMessages(roomId: number) {
    return await this.prisma.message.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });
  }
}
