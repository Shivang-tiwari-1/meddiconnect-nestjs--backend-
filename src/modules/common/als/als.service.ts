import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AlsService {
  private asyncLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();

  run(callback: () => any) {
    this.asyncLocalStorage.run(new Map(), callback);
  }

  set<T>(key: string, value: T) {
    const store = this.asyncLocalStorage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get<T>(key: string): T | undefined {
    return this.asyncLocalStorage.getStore()?.get(key) as T | undefined;
  }

  setUserId(value: string) {
    this.set<typeof value>('user', value);
  }

  setRole(value: string) {
    this.set<typeof value>('Role', value);
  }

  getUserId() {
    const tmp = this.get<string>('user');
    if (!tmp) {
      throw new Error('Unknown User');
    }
    return tmp;
  }

  getRole() {
    const tmp = this.get<string>('Role');
    if (!tmp) {
      throw new Error('Unknown Role');
    }
    return tmp;
  }
}
