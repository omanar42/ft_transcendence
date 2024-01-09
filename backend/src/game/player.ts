export class Player {
  id: number;
  username: string;
  num: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(id: number, num: number) {
    this.id = id;
    this.username = '';
    this.num = num;
    this.y = 700 / 2 - 100 / 2;
    this.width = 16;
    this.height = 128;
    this.score = 0;
    if (this.num === 1) {
      this.x = 4;
      this.color = '#41a5fc';
    } else {
      this.x = 1300 - 5 - 16;
      this.color = '#f600d4';
    }
  }

  updatePaddlePosition(position) {
    this.y = position;
  }

  updateScore() {
    this.score++;
  }

  reset() {
    this.y = 700 / 2 - 100 / 2;
    this.width = 16;
    this.height = 128;
    this.score = 0;
    if (this.num === 1) {
      this.x = 4;
      this.color = '#41a5fc';
    } else {
      this.x = 1300 - 5 - 16;
      this.color = '#f600d4';
    }
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
      color: this.color,
      score: this.score,
    };
  }
}
