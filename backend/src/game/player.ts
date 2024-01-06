export class Player {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  score: number;

  constructor(id) {
    this.id = id;
    this.y = 700 / 2 - 100 / 2;
    this.width = 16;
    this.height = 128;
    this.score = 0;
    if (id === 1) {
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
    if (this.id === 1) {
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
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      color: this.color,
      score: this.score,
    };
  }
}
