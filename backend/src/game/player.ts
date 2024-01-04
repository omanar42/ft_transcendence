export class Player {
  id: number;
  paddlePosition: number;
  score: number;

  constructor(id) {
    this.id = id;
    this.paddlePosition = 0;
    this.score = 0;
  }

  updatePaddlePosition(position) {
    this.paddlePosition = position;
  }

  updateScore(score) {
    this.score = score;
  }

  reset() {
    this.paddlePosition = 0;
    this.score = 0;
  }

  toJSON() {
    return {
      id: this.id,
      paddlePosition: this.paddlePosition,
      score: this.score,
    };
  }
}
