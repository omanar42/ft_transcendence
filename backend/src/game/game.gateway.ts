import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { subscribe } from 'diagnostics_channel';

interface Player {
  x: number;
  y: number;
  score: number;
}

interface Ball {
  x: number;
  y: number;
}

interface GameState {
  user: Player;
  enemy: Player;
  ball: Ball;
}

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly gameService: GameService) {}

  // private gameSessions = new Map<string, GameSession>(); // GameSession is a custom class to manage game states

  private gameState: GameState;

  handleConnection(client: Socket, ...args: any[]) {
    // Handle new client connection
    console.log('Client connected ' + client.id);

    // Create new game session
    // const session = new GameSession();
    // this.gameSessions.set(client.id, session);

    // Init game state
    this.gameState = this.gameService.initState();
  }
  
  handleDisconnect(client: Socket) {
    // Handle client disconnect
    console.log('Client disconnected ' + client.id);
  }

  @SubscribeMessage('getGameState')
  handleGameState(client: Socket): void {
    console.log('Sending game state to client', client.id);
    this.server.to(client.id).emit('gameState', this.gameState);
  }


  // @SubscribeMessage('joinGame')
  // handleJoinGame(client: Socket, data): void {
  //   console.log('Joining game', data);
  // }

  // @SubscribeMessage('move')
  // handleMove(client: Socket, data): void {
  //   console.log('Move', data);
  // }

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
