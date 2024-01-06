import { Ball } from './ball';
import { Player } from './player';

export class GameState {
  playerOne: Player;
  playerTwo: Player;
  ball: Ball;
  running: boolean;
  roomId: string;

  constructor(_playerOne: Player, _playerTwo: Player) {
    this.playerOne = _playerOne;
    this.playerTwo = _playerTwo;
    this.ball = new Ball();
    this.running = false;
    this.roomId = `room:${_playerOne.id}${_playerTwo.id}`;
  }

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

    if (this.ball.x - this.ball.radius < 0) {
      this.playerTwo.updateScore();
      this.ball.resetBall();
    } else if (this.ball.x + this.ball.radius > 800) {
      this.playerOne.updateScore();
      this.ball.resetBall();
    }
  };
}
