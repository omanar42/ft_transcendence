export class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;

  constructor() {
    this.x = 1300 / 2;
    this.y = 700 / 2;
    this.radius = 16;
    this.speed = 6;
    this.velocityX = 6;
    this.velocityY = 2;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  resetBall = () => {
    this.x = 1300 / 2;
    this.y = 700 / 2;
    this.velocityX = -this.velocityX;
    this.velocityY = 2;
  };

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      radius: this.radius,
      speed: this.speed,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
    };
  }
}
