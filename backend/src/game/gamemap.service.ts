import { Injectable } from '@nestjs/common';

@Injectable()
export class GameMapService {
  private map: Map<string, any>;
  constructor() {
    this.map = new Map<string, any>();
    this.set('waitingList', []);
  }
  set(key: string, value: any) {
    this.map.set(key, value);
  }
  get(key: string) {
    return this.map.get(key) ?? null;
  }
  delete(key: string) {
    this.map.delete(key);
  }
}
