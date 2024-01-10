import { Ball } from './ball';
import { Player } from './player';

export class GameState {
  roomId: string;
  ball: Ball;
  playerOne: Player;
  playerTwo: Player;

  constructor() {
    this.playerOne = null;
    this.playerTwo = null;
    this.ball = null;
    this.roomId = '';
  }

  init = (playerOneId: string, playerTwoId: string) => {
    this.playerOne = new Player(playerOneId, 1);
    this.playerTwo = new Player(playerTwoId, 2);
    this.ball = new Ball();
    this.roomId = `room:${this.playerOne.id}${this.playerTwo.id}`;
  };

  paddleMove = (playerId: string, position: number) => {
    if (playerId === this.playerOne.id) this.playerOne.y = position;
    else if (playerId === this.playerTwo.id) this.playerTwo.y = position;
  };

  collision = (p: Player) => {
    const pTop = p.y;
    const pBottom = p.y + p.height;
    const pLeft = p.x;
    const pRight = p.x + p.width;

    const bTop = this.ball.y - this.ball.radius;
    const bBottom = this.ball.y + this.ball.radius;
    const bLeft = this.ball.x - this.ball.radius;
    const bRight = this.ball.x + this.ball.radius;

    return pLeft < bRight && pTop < bBottom && pRight > bLeft && pBottom > bTop;
  };

  update = () => {
    this.ball.update();

    const player = this.ball.x < 1300 / 2 ? this.playerOne : this.playerTwo;

    if (this.collision(player)) {
      let collidePoint = this.ball.y - (player.y + player.height / 2);
      collidePoint /= player.height / 2;

      const angleRad = (Math.PI / 4) * collidePoint;

      const direction = this.ball.x < 1300 / 2 ? 1 : -1;

      this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
      this.ball.velocityY = this.ball.speed * Math.sin(angleRad);

      this.ball.speed += 0.1;
    }

    if (this.ball.x - this.ball.radius <= 0) {
      this.playerTwo.updateScore();
      this.ball.resetBall();
      this.playerOne.reset();
      this.playerTwo.reset();
    } else if (this.ball.x + this.ball.radius >= 1300) {
      this.playerOne.updateScore();
      this.ball.resetBall();
      this.playerOne.reset();
      this.playerTwo.reset();
    }
  };

  toJSON = () => {
    return {
      playerOne: this.playerOne.toJSON(),
      playerTwo: this.playerTwo.toJSON(),
      ball: this.ball.toJSON(),
    };
  };
}
