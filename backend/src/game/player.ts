export class Player {
  id: string;
  num: number;
  username: string;
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;

  constructor(id: string, num: number) {
    this.id = id;
    this.username = '';
    this.num = num;
    this.width = 16;
    this.height = 128;
    this.score = 0;
    this.reset();
  }

  updatePaddlePosition(position: number) {
    this.y = position;
  }

  updateScore() {
    this.score++;
  }

  reset() {
    this.y = 700 / 2 - 100 / 2;
    if (this.num === 1) this.x = 4;
    else this.x = 1300 - 5 - 16;
  }

  toJSON() {
    return {
      id: this.id,
      num: this.num,
      username: this.username,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      score: this.score,
    };
  }
}
