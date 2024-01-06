import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { GameState } from './gameState';

interface Player {
  id: string;
  paddlePosition: number;
  score: number;
}

interface Room {
  id: string;
  players: Player[];
  gameState: GameState;
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private rooms: Map<string, Room> = new Map();

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string): void {
    // logic to add player to room
    // create room if it doesn't exist
    // add player to the room's player list
    // client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('paddleMove')
  handlepaddleMove(client: Socket, action: any) {
    // Update game state based on the action
    // For example, if action is a paddle move, update the player's paddle position
    // Then, emit the updated game state to all clients in the room
    // this.server.to(action.roomId).emit('gameStateUpdate', updatedGameState);

    // this.rooms.get(action.roomId).gameState.updatePlayerPosition(client.id, action.position);

    // this.server.to(action.roomId).emit('gameStateUpdate', this.rooms.get(action.roomId).gameState);
  }
}
