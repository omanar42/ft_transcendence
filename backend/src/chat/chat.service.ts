import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
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
import { parse } from 'path';
import { use } from 'passport';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private cacheService: CacheService,
  ) {}

  async AddUserToRoom(oauthId: string, data: any) {
    const owner = await this.GetUserByOauthId(oauthId);
    const room_user = owner.roomsuser.find(
      (roomuser) => roomuser.roomId === data.roomId,
    );
    if (!room_user || room_user.status !== 'OWNER') {
      throw new HttpException(
        'The User is not the owner of this room',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const target_user = await this.GetUserByUsername(data.username);
    if (!target_user) {
      throw new HttpException('The User is not found', HttpStatus.NOT_FOUND);
    }
    if (
      target_user.roomsuser.some((roomuser) => roomuser.roomId === data.roomId)
    ) {
      throw new HttpException(
        'The User is already a member of this room',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    await this.prisma.roomUser.create({
      data: {
        roomId: data.roomId,
        userId: target_user.oauthId,
      },
    });

    return await this.getRooms(oauthId);
  }
  async getRooms(oauthId: string) {
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
  async DMsToDMs_Front(DM: any, roomUser: string) {
    const user = await this.GetUserByOauthId(roomUser);
    const DM_front = new Room_Front_Dto();
    DM_front.Avatar = user.avatar;
    DM_front.roomName = user.username;
    DM_front.roomType = DM.type;
    DM_front.roomId = DM.id;
    DM_front.status = user.status;
    return DM_front;
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
      return null;
    }
    return user;
  }

  async GetMessagesByRoomId(roomId: number, oauthId: string) {
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
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
    const Messages_Front = new Messages_Front_Dto(Room_messages_model);
    const room_users = await this.GetRoomById(roomId);
    const the_user_is_banned = room_users.roomuser.find(
      (roomuser) => roomuser.userId === oauthId,
    );
    if (
      the_user_is_banned &&
      the_user_is_banned.status === UserStatusInRoom['BANNED']
    ) {
      throw new HttpException(
        'You are banned from this room',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const room_users_filtered = await this.filter_blocked_users(
      { oauthId: oauthId },
      room_users.roomuser,
    );
    if (room_users.type === RoomType['DIRECT_MESSAGE']) {
      const friendId = room_users.roomuser.find(
        (roomuser) => roomuser.userId !== oauthId,
      );
      const friendUser = await this.GetUserByOauthId(friendId.userId);
      Messages_Front.roomName = friendUser.username;
      Messages_Front.Avatar = friendUser.avatar;
    }
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
      roomuser_front.muted = room_user.muted;
      front_members.push(roomuser_front);
    }
    return front_members;
  }
  async explore(oauthId: string) {
    const rooms = await this.GetUserByOauthId(oauthId).then((user) => {
      return user.roomsuser;
    });
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
  async AddUserToPrivateRoom(seter: string, target: string, roomId: number) {
    const room = await this.GetRoomById(roomId);
    const target_user_model = await this.GetUserByUsername(target);
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
    if (target_user.status === UserStatusInRoom['MEMBER']) {
      throw new Error('User is already a member');
    }
  }
  async UpdateRoom(oauthId: string, data: any) {
    const roomTypes = ['public', 'private', 'protected'];
    const room = await this.GetRoomById(data.roomId);
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.GetUserByOauthId(oauthId);
    const roomuser = room.roomuser.find(
      (roomuser) => roomuser.userId === user.oauthId,
    );
    if (!roomuser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (roomuser.status !== UserStatusInRoom['OWNER']) {
      throw new HttpException(
        'You are not the owner of this room',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (!roomTypes.includes(data.type.toLocaleLowerCase())) {
      throw new HttpException(
        'Room type not correct',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    await this.prisma.room.update({
      where: {
        id: data.roomId,
      },
      data: {
        name: data.roomName,
        type: RoomType[data.type.toUpperCase()],
      },
    });
    if (data.type.toLowerCase() === 'protected') {
      if (!data.password || data.password === '') {
        throw new HttpException(
          'Room password empty',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const hashedPass_ = await bcrypt.hash(data.password, 10);
      await this.prisma.room.update({
        where: {
          id: room.id,
        },
        data: {
          hashedPass: hashedPass_,
        },
      });
    }
    return await this.getRooms(oauthId);
  }
  async GetRoomById(roomId: number) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        roomuser: true,
      },
    });
    if (!room) {
      null;
    }
    return room;
  }

  async GetUserByUsername(username: string) {
    if (username == null) {
      return null;
    }
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        rooms: true,
        roomsuser: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async GetBlockedUsers(oauthId: string) {
    let blocked_users = [];
    const blocked = await this.usersService.getBlocked(oauthId);
    for (const block of blocked) {
      blocked_users.push(await this.GetUserByOauthId(block.friendId));
    }
    if (!blocked_users) {
      throw new Error('User not found');
    }
    return blocked_users;
  }
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
    return this.GetRoomUsers(roomId);
  }
  async setAdminForRoom(roomId: number, seter: string, target: string) {
    const room = await this.GetRoomById(roomId);
    const target_userModel = await this.GetUserByUsername(target);
    if (!target_userModel) {
      throw new HttpException('User not found admin', HttpStatus.NOT_FOUND);
    }
    target = target_userModel.oauthId;
    const seter_user = room.roomuser.find(
      (roomuser) => roomuser.userId === seter,
    );
    const target_user = room.roomuser.find(
      (roomuser) => roomuser.userId === target,
    );
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
    if (target_user.status === UserStatusInRoom['OWNER']) {
      throw new HttpException(
        'You cant set admin for the owner',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (!seter_user || !target_user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (seter_user.status !== UserStatusInRoom['OWNER']) {
      throw new HttpException('You are not the owner of this room', 403);
    }
    if (target_user.status === UserStatusInRoom['ADMIN']) {
      throw new HttpException('User is already an admin', 403);
    }
    await this.prisma.roomUser.update({
      where: {
        id: target_user.id,
      },
      data: {
        status: UserStatusInRoom['ADMIN'],
      },
    });
    return this.GetRoomUsers(roomId);
  }
  async filter_blocked_users(sender: { oauthId: string }, roomUsers: any[]) {
    const blockedlist_sender = await this.GetBlockedUsers(sender.oauthId);
    let users_list_not_blocked = [];
    for (const roomuser of roomUsers) {
      if (roomuser.status === UserStatusInRoom['BANNED']) {
        continue;
      }
      const temp_list_blocked = await this.GetBlockedUsers(roomuser.userId);
      const isBlockedBySender = blockedlist_sender.some(
        (blocked) => blocked.oauthId === roomuser.userId,
      );
      const hasBlockedSender = temp_list_blocked.some(
        (blocked) => blocked.oauthId === sender.oauthId,
      );
      if (!isBlockedBySender && !hasBlockedSender) {
        users_list_not_blocked.push(roomuser);
      }
    }
    return users_list_not_blocked;
  }
  async Leaveroom(oauthId: string, data: any) {
    const room = await this.GetRoomById(data.roomId);
    const roomuser = room.roomuser.find(
      (roomuser) => roomuser.userId === oauthId,
    );
    const RoomMembers = room.roomuser;
    if (!roomuser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (roomuser && room.type !== RoomType['DIRECT_MESSAGE']) {
      if (roomuser.status === UserStatusInRoom['BANNED']) {
        throw new HttpException(
          'You are banned from this room',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      if (roomuser.status === UserStatusInRoom['OWNER']) {
        if (!data.newOwner) {
          throw new HttpException(
            'You must specify a new owner',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        const newOwner = await this.GetUserByUsername(data.newOwner);
        if (!newOwner) {
          throw new HttpException('New owner not found', HttpStatus.NOT_FOUND);
        }
        if (newOwner.oauthId === oauthId) {
          throw new HttpException(
            `You can't make yourself the new owner`,
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        if (
          !RoomMembers.some((roomuser) => roomuser.userId === newOwner.oauthId)
        ) {
          throw new HttpException(
            'New owner is not a member of this room',
            HttpStatus.NOT_ACCEPTABLE,
          );
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
      return this.getRooms(oauthId);
    }
  }
  async MuteUserFromRoom(oauthId: string, data: any, status: string) {
    const room = await this.GetRoomById(data.roomId);
    const user = await this.GetUserByOauthId(oauthId);
    const target_user = await this.GetUserByUsername(data.target_username);
    const roomuser = room.roomuser.find(
      (roomuser) => roomuser.userId === target_user.oauthId,
    );
    const seter_user = room.roomuser.find(
      (roomuser) => roomuser.userId === oauthId,
    );
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
    if (!roomuser.muted && status === 'UNMUTE') {
      throw new HttpException('User is not muted', HttpStatus.NOT_ACCEPTABLE);
    }
    if (target_user.oauthId === oauthId) {
      throw new HttpException(
        'You cant mute yourself',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!roomuser) {
      throw new HttpException(
        'User not a member of this room',
        HttpStatus.NOT_FOUND,
      );
    }
    if (roomuser.status === UserStatusInRoom['BANNED']) {
      throw new HttpException(
        'User is banned from this room',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (roomuser.status === UserStatusInRoom['OWNER']) {
      throw new HttpException(
        'You cant mute the owner',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (seter_user.status === UserStatusInRoom['MEMBER']) {
      throw new HttpException(
        'You are not allowed to mute users',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (roomuser.muted && status === 'MUTE') {
      throw new HttpException(
        'User is already muted',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (status === 'MUTE') {
      await this.prisma.roomUser.update({
        where: {
          id: roomuser.id,
        },
        data: {
          muted: true,
        },
      });
    } else {
      await this.prisma.roomUser.update({
        where: {
          id: roomuser.id,
        },
        data: {
          muted: false,
        },
      });
    }
    return this.GetRoomUsers(data.roomId);
  }
  async BanUserFromRoom(
    roomId: number,
    seter_oauthId: string,
    target_username: string,
    status: string,
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
      throw new HttpException('User or Room not found', HttpStatus.NOT_FOUND);
    }
    if (
      seter_user.status === UserStatusInRoom['MEMBER'] ||
      target_user.status === UserStatusInRoom['OWNER'] ||
      (seter_user.status === UserStatusInRoom['ADMIN'] &&
        target_user.status === UserStatusInRoom['ADMIN'])
    ) {
      throw new HttpException('You are not allowed to ban users', 403);
    }
    if (
      target_user.status === UserStatusInRoom['BANNED'] &&
      status === 'BANNED'
    ) {
      throw new HttpException('User is already banned', 403);
    }
    if (
      target_user.status !== UserStatusInRoom['BANNED'] &&
      status === 'MEMBER'
    ) {
      throw new HttpException('User is not banned', 403);
    }
    await this.prisma.roomUser.update({
      where: {
        id: target_user.id,
      },
      data: {
        status: UserStatusInRoom[status.toUpperCase()],
      },
    });
    return this.GetRoomUsers(roomId);
  }

  async createMessage(serv: Server, createMessageDto: CreateMessageDto) {
    const room = await this.GetRoomById(createMessageDto.roomId);
    const sender = await this.GetUserByUsername(createMessageDto.userName);
    const sender_rommuser = room.roomuser.find(
      (roomuser) => roomuser.userId === sender.oauthId,
    );
    if (sender_rommuser.muted) {
      return;
    }
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
        if (_client) {
          serv
            .to(_client.id)
            .emit('new_message', await this.Socket_Front_Dto(message));
        }
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
  
    const room = await this.prisma.room.create({
      data: {
        name: createRoomDto.roomName,
        ownerId: user.oauthId,
        type: RoomType[createRoomDto.roomType.toUpperCase()],
      },
    });
    if (createRoomDto.roomType.toLowerCase() === 'protected') {
      const hashedPass_ = await bcrypt.hash(createRoomDto.roomPassword, 10);
      await this.prisma.room.update({
        where: {
          id: room.id,
        },
        data: {
          hashedPass: hashedPass_,
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

  async joinRoom(oauthId: string, roomId: number, password: string) {
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
      const isMatch = await bcrypt.compare(password, room_.hashedPass);
      if (!isMatch) {
        throw new Error('Wrong password');
      }
    }
    await this.prisma.roomUser.create({
      data: {
        roomId: roomId,
        userId: oauthId,
      },
    });
    return await this.explore(oauthId);
  }

  async getDms(oauthId: string) {
    const user = await this.GetUserByOauthId(oauthId);
    const rooms_user = user.roomsuser;
    const rooms_front = [];
    if (!rooms_user) {
      return [];
    }
    for (const roomuser of rooms_user) {
      const room = await this.GetRoomById(roomuser.roomId);
      if (room.type === RoomType['DIRECT_MESSAGE']) {
        const users_not_blocked = await this.filter_blocked_users(
          { oauthId },
          room.roomuser,
        );
        for (const roomuser_ of users_not_blocked) {
          if (roomuser_.userId !== oauthId) {
            const DM_front = await this.DMsToDMs_Front(room, roomuser_.userId);
            rooms_front.push(DM_front);
          }
        }
      }
    }
    return rooms_front;
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
