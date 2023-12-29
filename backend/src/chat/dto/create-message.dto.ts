import { Message } from '../entities/message.entity';

export class CreateMessageDto extends Message {
  content: string;
  roomId: number;
  username: string;
}

export class CreateDirectMessageDto extends Message {
  username_target: string;
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
