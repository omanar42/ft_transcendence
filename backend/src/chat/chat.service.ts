import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
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
  Message_Front_Dto,
  Messages_Front_Dto,
  RoomUser_front_Dto,
  Room_Front_Dto,
} from './dto/create-message.dto';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { RoomType, UserStatusInRoom } from '@prisma/client';
import { CacheService } from './cache.service';
// import { send } from 'process';
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
  async getRooms(oauthId: string) {
    // to do : test this function
    const user = await this.GetUserByOauthId(oauthId);
    const rooms = user.roomsuser;
    if (!rooms) {
      return [];
    }
    const rooms_front = [];
    for (const room of rooms) {
      const room_front = await this.convertRoomToRoom_Front(
        await this.GetRoomById(room.roomId),
      );
      if (room_front.roomType !== 'DIRECT_MESSAGE') {
        rooms_front.push(room_front);
      }
    }
    return rooms_front;
  }

  async convertRoomToRoom_Front(room_back: any) {
    const room_Front = new Room_Front_Dto();
    room_Front.Avatar = room_back.avatar;
    room_Front.roomName = room_back.name;
    room_Front.roomType = room_back.type;
    room_Front.roomId = room_back.id;

    return room_Front;
  }

  async Socket_Front_Dto(Message: any) {
    const Message_sock_front = new Message_Front_Dto();
    Message_sock_front.message = Message.content;
    Message_sock_front.roomId = Message.roomId;
    Message_sock_front.userName = await this.GetUserByOauthId(
      Message.userId,
    ).then((user) => {
      return user.username;
    });
    Message_sock_front.time = Message.createdAt.toString();
    return Message_sock_front;
  }

  async SetOauthIdSocket(oauthid: string, client: Socket) {
    const cacheKey = `socket:${oauthid}`;
    this.cacheService.set(cacheKey, client);
    this.cacheService.set(`socket:${client.id}`, oauthid);
  }
  async GetOauthIdSocket(oauthid: string) {
    const cacheKey = `socket:${oauthid}`;
    const cachedSocket = this.cacheService.get(cacheKey);
    if (cachedSocket) {
      return cachedSocket;
    }
    const user = await this.prisma.user.findUnique({
      where: {
        oauthId: oauthid,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
  }
  async DeleteOauthIdSocket(client: Socket) {
    const cacheKey = `socket:${client.id}`;
    const cachedSocket = this.cacheService.get(cacheKey);
    if (cachedSocket) {
      this.cacheService.delete(cacheKey);
      this.cacheService.delete(`socket:${cachedSocket}`);
    }
  }

  async GetUserByOauthId(oauthId: string) {
    const cacheKey = `user:${oauthId}`;
    const cachedUser = this.cacheService.get(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.prisma.user.findUnique({
      where: {
        oauthId: oauthId,
      },
      include: {
        rooms: true,
        roomsuser: true,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    this.cacheService.set(cacheKey, user);
    return user;
  }

  async GetMessagesByRoomId(roomId: number, oauthId: string) {
    // const cacheKey = `messages:${roomId}${oauthId}`;
    // const cachedMessages = this.cacheService.get(cacheKey);
    // if (cachedMessages) {
    //   return cachedMessages;
    // }
    const Room_messages_model = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        },
      },
    });
    const messages = Room_messages_model.messages;
    if (!Room_messages_model) {
      throw new Error('Room not found');
    }
    const Messages_Front = new Messages_Front_Dto(Room_messages_model);
    const room_users = await this.GetRoomById(roomId);
    const room_users_filtered = await this.filter_blocked_users(
      { oauthId: oauthId },
      room_users.roomuser,
    );
    for (const message of messages) {
      const message_front = new Message_Front_Dto();
      message_front.message = message.content;
      message_front.roomId = message.roomId;
      message_front.userName = await this.GetUserByOauthId(message.userId).then(
        (user) => {
          return user.username;
        },
      );
      message_front.time = message.createdAt.toString();
      if (room_users_filtered.some((user) => user.userId === message.userId)) {
        Messages_Front.messages.push(message_front);
      }
    }
    Messages_Front.messages.reverse();
    return Messages_Front;
  }
  async GetRoomUsers(roomId: number) {
    // eslint-disable-next-line prefer-const
    let front_members = [];
    const room = await this.GetRoomById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    const room_users = room.roomuser;
    for (const roomuser of room.roomuser) {
      const user = await this.GetUserByOauthId(roomuser.userId);
      const room_user = room_users.find(
        (roomuser) => roomuser.userId === user.oauthId,
      );
      const roomuser_front = new RoomUser_front_Dto(user);
      roomuser_front.status = room_user.status;
      front_members.push(roomuser_front);
    }
    return front_members;
  }
  async explore(oauthId: string) {
    const rooms = await this.GetUserByOauthId(oauthId).then((user) => {
      return user.roomsuser;
    });
    console.log(rooms);
    const rooms_explore = [];
    const all_rooms = await this.prisma.room.findMany({
      where: {
        OR: [
          {
            type: RoomType['PUBLIC'],
          },
          {
            type: RoomType['PROTECTED'],
          },
        ],
      },
    });
    for (const room of all_rooms) {
      if (!rooms.some((room_) => room_.roomId === room.id)) {
        rooms_explore.push(await this.convertRoomToRoom_Front(room));
      }
    }
    return rooms_explore;
  }
  // async GetRoomUsers(roomId: number) {
  //   const cacheKey = `roomusers:${roomId}`;
  //   const cachedRoomUsers = this.cacheService.get(cacheKey);
  //   if (cachedRoomUsers) {
  //     return cachedRoomUsers;
  //   }
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
  //   this.cacheService.set(cacheKey, room.roomuser);
  //   return room.roomuser;
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
      include: {
        rooms: true,
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
    // eslint-disable-next-line prefer-const
    let blocked_users = [];
    const blocked = await this.usersService.getBlocked(oauthId);
    for (const block of blocked) {
      blocked_users.push(await this.GetUserByOauthId(block.friendId));
    }
    if (!blocked_users) {
      throw new Error('User not found');
    }
    this.cacheService.set(cacheKey, blocked_users);
    return blocked_users;
  }

  // the seter is oauthId of the user
  async KickUserFromRoom(roomId: number, seter: string, target: string) {
    const room = await this.GetRoomById(roomId);
    const target_userModel = await this.GetUserByUsername(target);
    const target_user = room.roomuser.find(
      (roomuser) => roomuser.userId === target_userModel.oauthId,
    );
    const seter_user = room.roomuser.find(
      (roomuser) => roomuser.userId === seter,
    );
    if (!room || !seter_user || !target_user) {
      throw new Error('User or Room not found');
    }
    if (target_user.status === UserStatusInRoom['OWNER']) {
      throw new Error('You cant kick the owner');
    }
    if (
      seter_user.status === UserStatusInRoom['MEMBER'] ||
      (seter_user.status === UserStatusInRoom['ADMIN'] &&
        target_user.status === UserStatusInRoom['ADMIN'])
    ) {
      throw new Error('You are not allowed to kick users');
    }
    await this.prisma.roomUser.delete({
      where: {
        id: target_user.id,
      },
    });
    this.cacheService.delete(`room:${roomId}`);
  }
  // the seter is oauthId of the user
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
  async Leaveroom(oauthId: string, data: any) {
    const room = await this.GetRoomById(data.roomId);
    const user = await this.GetUserByOauthId(oauthId);
    const roomuser = room.roomuser.find(
      (roomuser) => roomuser.userId === oauthId,
    );
    const RoomMembers = room.roomuser;
    if (roomuser && room.type !== RoomType['DIRECT_MESSAGE']) {
      if (roomuser.status === UserStatusInRoom['OWNER']) {
        if (!data.newOwner) {
          throw new Error(
            'You are the owner of this room , you have to choose a new owner',
          );
        }
        const newOwner = await this.GetUserByUsername(data.newOwner);
        if (!newOwner) {
          throw new Error('New owner not found');
        }
        if (
          !RoomMembers.some((roomuser) => roomuser.userId === newOwner.oauthId)
        ) {
          throw new Error('New owner is not a member of this room');
        }
        await this.prisma.roomUser.delete({
          where: {
            id: roomuser.id,
          },
        });
        await this.prisma.room.update({
          where: {
            id: room.id,
          },
          data: {
            ownerId: newOwner.oauthId.toString(),
          },
        });
        const newOwner_roomuser = room.roomuser.find(
          (roomuser) => roomuser.userId === newOwner.oauthId,
        );
        await this.prisma.roomUser.update({
          where: {
            id: newOwner_roomuser.id,
          },
          data: {
            status: UserStatusInRoom['OWNER'],
          },
        });
      } else {
        await this.prisma.roomUser.delete({
          where: {
            id: roomuser.id,
          },
        });
      }
    }
    this.cacheService.delete(`room:${data.roomId}`);
    this.cacheService.delete(`user:${oauthId}`);
    this.cacheService.delete(`user:${user.username}`);
  }
  async BanUserFromRoom(
    roomId: number,
    seter_oauthId: string,
    target_username: string,
  ) {
    const room = await this.GetRoomById(roomId);

    const seter_user = room.roomuser.find(
      (roomuser) => roomuser.userId === seter_oauthId,
    );
    const target_user_model = await this.GetUserByUsername(target_username);
    const target_user = room.roomuser.find(
      (roomuser) => roomuser.userId === target_user_model.oauthId,
    );
    if (!room || !seter_user || !target_user) {
      throw new Error('User or Room not found');
    }
    if (seter_user.status === UserStatusInRoom['MEMBER']) {
      throw new Error('You are not allowed to ban users');
    }
    if (target_user.status === UserStatusInRoom['BANNED']) {
      throw new Error('User is already banned');
    }
    if (
      target_user.status !== UserStatusInRoom['OWNER'] ||
      (target_user.status === UserStatusInRoom['ADMIN'] &&
        seter_user.status !== UserStatusInRoom['ADMIN'])
    ) {
      await this.prisma.roomUser.update({
        where: {
          id: target_user.id,
        },
        data: {
          status: UserStatusInRoom['BANNED'],
        },
      });
    }
    this.cacheService.delete(`room:${roomId}`);
  }
  async createMessage(serv: Server, createMessageDto: CreateMessageDto) {
    const room = await this.GetRoomById(createMessageDto.roomId);
    const sender = await this.GetUserByUsername(createMessageDto.userName);
    const sender_rommuser = room.roomuser.find(
      (roomuser) => roomuser.userId === sender.oauthId,
    );
    if (
      !(await this.identifyUser(createMessageDto)) ||
      sender_rommuser.status === UserStatusInRoom['BANNED']
    ) {
      throw new Error('User does not have access to this room');
    }
    const message = await this.prisma.message.create({
      data: {
        content: createMessageDto.message,
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
    new_roomUsers.forEach(async (user) => {
      if (user.userId !== sender.oauthId) {
        const _client = await this.GetOauthIdSocket(user.userId);
        serv
          .to(_client.id)
          .emit('new_message', await this.Socket_Front_Dto(message));
      }
    });
  }

  async identifyUser(createMessageDto: CreateMessageDto): Promise<boolean> {
    const user = await this.GetUserByUsername(createMessageDto.userName);
    const room = await this.GetRoomById(createMessageDto.roomId);
    const isUserInRoom = room.roomuser.some(
      (roomuser) => roomuser.userId === user.oauthId,
    );
    return isUserInRoom;
  }
  async directMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() direct: CreateDirectMessageDto,
  ) {
    // use this function directly after accept friend request
    const user_1 = await this.GetUserByUsername(direct.userName);
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
    if (!types.includes(createRoomDto.roomType.toLocaleLowerCase())) {
      if (
        createRoomDto.roomType === 'protected' &&
        (!createRoomDto.roomPassword || createRoomDto.roomPassword === '')
      ) {
        throw new Error('Room password empty');
      }
      throw new Error('Room type not correct');
    }
    // this.prisma.user.update({
    //   where: {
    //     username: createRoomDto.userName,
    //   },
    //   data: {
    //     socketId: client.id,
    //   },
    // });
    this.cacheService.delete(`user:${createRoomDto.userName}`);
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

  async joinRoom(oauthId: string, roomId: number) {
    // const user = await this.GetUserByUsername(createRoomDto.username);
    const user = await this.GetUserByOauthId(oauthId);
    const room_ = await this.GetRoomById(roomId);
    if (room_.type === RoomType['DIRECT_MESSAGE']) {
      throw new Error(
        'you dont have access to this direct message , ghayrha ya 7abibi',
      );
    }
    if (room_.roomuser.some((roomuser) => roomuser.userId === user.oauthId)) {
      throw new Error('User already in room');
    }
    if (room_.type === RoomType['PROTECTED']) {
      if (!(await bcrypt.compare(room_.hashedPass, user.password))) {
        throw new Error('Wrong password');
      }
    }
    await this.prisma.roomUser.create({
      data: {
        roomId: roomId,
        userId: oauthId,
      },
    });
    this.cacheService.delete(`room:${roomId}`);
    this.cacheService.delete(`user:${oauthId}`);
    this.cacheService.delete(`user:${user.username}`);
    return await this.explore(oauthId);
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
