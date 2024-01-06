import { Injectable } from '@nestjs/common';
import { GameState } from './gameState';

@Injectable()
export class GameService {
  constructor() {}

  update = (gameState: GameState) => {
    gameState.update();
  }
}
