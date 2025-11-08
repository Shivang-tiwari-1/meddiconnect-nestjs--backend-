import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisSevice implements OnModuleDestroy {
  public redis: Redis;
  public pub: Redis;
  public sub: Redis;
  constructor() {
    if (process.env.REDIS_URL) {
      this.pub = new Redis(process.env.REDIS_URL);
      this.sub = new Redis(process.env.REDIS_URL);
      this.redis = new Redis(process.env.REDIS_URL);
    }

    this.sub.on('connect', () => console.log('✅ Redis Sub Connected'));
    this.pub.on('connect', () => console.log('✅ Redis Pub Connected'));
    this.redis.on('connect', () => console.log('✅ Redis Main Connected'));
  }

  async onModuleDestroy() {
    await this.redis.quit();
    await this.pub.quit();
    await this.sub.quit();
  }

  getClients() {
    return {
      redis: this.redis,
      sub: this.sub,
      pub: this.pub,
    };
  }
}
