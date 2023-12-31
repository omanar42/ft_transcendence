import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {}

  private gameSessions = new Map<string, GameSession>(); // GameSession is a custom class to manage game states
  private rooms = [];

  handleConnection(client: any, ...args: any[]) {
    // Handle new client connection
    console.log('Client connected');
  }

  handleDisconnect(client: any) {
    // Handle client disconnect
    console.log('Client disconnected');
  }

  @SubscribeMessage('joinGame')
  handleJoinGame(client: any, data): void {
    console.log('Joining game', data);

    if (this.rooms.length > 0 && this.rooms[this.rooms.length - 1].players.length === 1) {
      this.rooms[this.rooms.length - 1].players.push(data);
      client.join(this.rooms[this.rooms.length - 1].name);
      this.server.to(this.rooms[this.rooms.length - 1].name).emit('gameState', this.rooms[this.rooms.length - 1]);
    }
  }

  // @SubscribeMessage('playerAction')
  // handlePlayerAction(client: Socket, action: any): void {
  //   // Handle player actions like movements
  //   // Update game state here

  //   // Emit updated state to clients
  //   const session = this.gameSessions.get(client.id);
  //   if (session) {
  //     this.gameService.updateState(action);
  //     this.broadcastGameState();
  //   }
  // }

  // private broadcastGameState() {
  //   this.gameSessions.forEach((session, sessionId) => {
  //     this.server.to(sessionId).emit('gameState', session.getState());
  //   });
  // }
}
