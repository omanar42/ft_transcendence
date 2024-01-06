import { Message } from '../entities/message.entity';

export class CreateMessageDto extends Message {
  message: string;
  roomId: number;
  userName: string;
}

export class CreateDirectMessageDto extends Message {
  username_target: string;
}

export class RoomUser_front_Dto {
  constructor(data: any) {
    this.UserName = data.username;
    this.Avatar = data.avatar;
  }
  UserName: string;
  Avatar: string;
  status: string;
}
export class Room_Front_Dto {
  constructor() {
    this.Avatar = '';
    this.roomName = '';
    this.roomType = '';
    this.roomId = 0;
  }
  Avatar: string;
  roomName: string;
  roomType: string;
  roomId: number;
}
export class Message_Front_Dto {
  message: string;
  roomId: number;
  userName: string;
  time: string;
}
export class Messages_Front_Dto extends Room_Front_Dto {
  constructor(data: any) {
    super();
    this.Avatar = data.avatar;
    this.roomName = data.name;
    this.roomType = data.type;
    this.roomId = data.id;
    this.messages = [];
  }
  messages: Message_Front_Dto[];
}
export class CreateRoomDto {
  userName: string;
  roomName: string;
  roomType: string;
  roomPassword?: string;
  roomId?: number;
}

export class JoinRoomDto {
  username: string;
  roomId: number;
  // password: string;
}

export class Data {
  username: string;
}
