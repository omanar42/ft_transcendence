export class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number;
  velocityY: number;

  constructor() {
    this.resetBall();
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.y + this.radius >= 699 || this.y - this.radius <= 1)
      this.velocityY = -this.velocityY;
  }

  resetBall = () => {
    this.x = 1300 / 2;
    this.y = 700 / 2;
    this.radius = 16;
    this.speed = 6;
    this.velocityX = 5;
    this.velocityY = 5;
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
