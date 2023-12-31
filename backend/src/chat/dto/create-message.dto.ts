import { Message } from '../entities/message.entity';

export class CreateMessageDto extends Message {
  message: string;
  roomId: number;
  userName: string;
}

export class CreateDirectMessageDto extends Message {
  username_target: string;
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
