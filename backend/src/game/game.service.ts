import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

const user = {
  x: 5,
  y: 800 / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "#41a5fc",
  score: 0,
};

const enemy = {
  x: 1400 - 15,
  y: 800 / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "#f600d4",
  score: 0,
};

const net = {
  x: 1400 / 2 - 2 / 2,
  y: 0,
  width: 2,
  height: 10,
  color: "#6574cd",
};

const ball = {
  x: 1400 / 2,
  y: 800 / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "#6574cd",
};

@Injectable()
export class GameService {
	private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });

    // Handle other events and messages from the client
    socket.on('playerAction', (action) => {
      this.updateState(action);
      this.broadcastGameState();
    });
  }

  collision(player, ball): boolean {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
  }

  resetBall(): void {
    ball.x = 1400 / 2;
    ball.y = 800 / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
  }

  update(): void {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if (ball.y + ball.radius > 800 || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < 1400 / 2) ? user : enemy;
    if (this.collision(player, ball)) {
      let collidePoint = (ball.y - (player.y + player.height / 2));
      collidePoint = collidePoint / (player.height / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction = (ball.x < 1400 / 2) ? 1 : -1;
      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);
      ball.speed += 0.1;
    }
    if (ball.x - ball.radius < 0) {
      enemy.score++;
      this.resetBall();
    } else if (ball.x + ball.radius > 1400) {
      user.score++;
      this.resetBall();
    }
  }

  getState(): any {
    return { user, enemy, ball, net };
  }

  updateState(action: any): void {
    switch (action.type) {
      case "MOVE_UP":
        user.y -= 8;
        break;
      case "MOVE_DOWN":
        user.y += 8;
        break;
    }
  }

  broadcastGameState(): void {
    this.connectedClients.forEach((client) => {
      client.emit('gameState', this.getState());
    });
  }

  // Add more methods for handling events, messages, etc.
}
