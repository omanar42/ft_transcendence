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
  JoinRoomDto,
} from './dto/create-message.dto';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { RoomType, UserStatusInRoom } from '@prisma/client';
import { CacheService } from './cache.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private cacheService: CacheService,
  ) {}
  // async handleConnection(client: Socket, data: Data) {
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
  // }
  async GetRoomById(roomId: number) {
    const cacheKey = `room:${roomId}`;
    const cachedRoom = this.cacheService.get(cacheKey);
    if (cachedRoom) {
      return cachedRoom;
    }
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        roomuser: true,
      },
    });
    if (!room) {
      throw new Error('Room not found');
    }
    this.cacheService.set(cacheKey, room);
    return room;
  }

  async GetUserByUsername(username: string) {
    const cacheKey = `user:${username}`;
    const cachedUser = this.cacheService.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    this.cacheService.set(cacheKey, user);
    return user;
  }

  async GetBlockedUsers(oauthId: string) {
    const cacheKey = `blocked:${oauthId}`;
    const cachedBlocked = this.cacheService.get(cacheKey);
    if (cachedBlocked) {
      return cachedBlocked;
    }
    const blocked = await this.usersService.getBlocked(oauthId);
    if (!blocked) {
      throw new Error('User not found');
    }
    this.cacheService.set(cacheKey, blocked);
    return blocked;
  }

  async setAdminForRoom(roomId: number, seter: string, target: string) {
    const room = await this.GetRoomById(roomId);
    const seter_user = room.roomuser.find(
      (roomuser) => roomuser.userId === seter,
    );
    const target_user = room.roomuser.find(
      (roomuser) => roomuser.userId === target,
    );
    if (!room || !seter_user || !target_user) {
      throw new Error('User or Room not found');
    }
    if (seter_user.status !== UserStatusInRoom['OWNER']) {
      throw new Error('You are not the owner of this room');
    }
    if (target_user.status === UserStatusInRoom['ADMIN']) {
      throw new Error('User is already an admin');
    }
    await this.prisma.roomUser.update({
      where: {
        id: target_user.id,
      },
      data: {
        status: UserStatusInRoom['ADMIN'],
      },
    });
    this.cacheService.delete(`room:${roomId}`);
  }
  async filter_blocked_users(sender: { oauthId: string }, roomUsers: any[]) {
    const blockedlist_sender = await this.GetBlockedUsers(sender.oauthId);
    // eslint-disable-next-line prefer-const
    let users_list_not_blocked = [];
    for (const roomuser of roomUsers) {
      const temp_list_blocked = await this.GetBlockedUsers(roomuser.userId);
      const isBlockedBySender = blockedlist_sender.some(
        (blocked) => blocked.userId === roomuser.userId,
      );
      const hasBlockedSender = temp_list_blocked.some(
        (blocked) => blocked.userId === sender.oauthId,
      );

      if (!isBlockedBySender && !hasBlockedSender) {
        users_list_not_blocked.push(roomuser);
      }
    }
    return users_list_not_blocked;
  }
  async createMessage(client: Socket, createMessageDto: CreateMessageDto) {
    if (!(await this.identifyUser(createMessageDto))) {
      throw new Error('User does not have access to this room');
    }
    const sender = await this.GetUserByUsername(createMessageDto.username);
    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        roomId: createMessageDto.roomId,
        userId: sender.oauthId,
      },
    });
    const roomUsers = await this.prisma.roomUser.findMany({
      where: {
        roomId: createMessageDto.roomId,
      },
      include: {
        user: true,
      },
    });
    const new_roomUsers = await this.filter_blocked_users(sender, roomUsers);
    new_roomUsers.forEach((user) => {
      client.to(user.user.socketId).emit('message', message);
    });
  }

  async identifyUser(createMessageDto: CreateMessageDto): Promise<boolean> {
    const user = await this.GetUserByUsername(createMessageDto.username);
    const isUserInRoom = await this.prisma.roomUser.findMany({
      where: {
        roomId: createMessageDto.roomId,
        userId: user.oauthId,
      },
    });
    return !!isUserInRoom;
  }
  async directMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() direct: CreateDirectMessageDto,
  ) {
    // use this function directly after accept friend request
    const user_1 = await this.GetUserByUsername(direct.username);
    const user_2 = await this.GetUserByUsername(direct.username_target);
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
    return room;
  }
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: CreateRoomDto,
  ) {
    const user = await this.GetUserByUsername(createRoomDto.userName);
    const types = ['public', 'private', 'protected'];
    if (!types.includes(createRoomDto.roomType)) {
      if (
        createRoomDto.roomType === 'protected' &&
        (!createRoomDto.roomPassword || createRoomDto.roomPassword === '')
      ) {
        throw new Error('Room password empty');
      }
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
      await this.prisma.room.update({
        where: {
          id: room.id,
        },
        data: {
          hashedPass: await bcrypt.hash(createRoomDto.roomPassword, 10),
        },
      });
    }
    await this.prisma.roomUser.create({
      data: {
        roomId: room.id,
        userId: user.oauthId,
        status: UserStatusInRoom['OWNER'],
      },
    });
    return room;
  }

  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: JoinRoomDto,
  ) {
    const user = await this.GetUserByUsername(createRoomDto.username);
    const room_ = await this.GetRoomById(createRoomDto.roomId);
    if (room_.type === RoomType['DIRECT_MESSAGE']) {
      throw new Error(
        'you dont have access to this direct message , ghayrha ya 7abibi',
      );
    }
    if (room_.roomuser.some((roomuser) => roomuser.userId === user.oauthId)) {
      throw new Error('User already in room');
    }

    await this.prisma.roomUser.create({
      data: {
        roomId: createRoomDto.roomId,
        userId: user.oauthId,
      },
    });
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
