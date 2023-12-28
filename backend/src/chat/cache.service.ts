import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache: Map<string, any>;
  set(key: string, value: any) {
    this.cache.set(key, value);
  }
  get(key: string) {
    return this.cache.get(key);
  }
  delete(key: string) {
    this.cache.delete(key);
  }
}
