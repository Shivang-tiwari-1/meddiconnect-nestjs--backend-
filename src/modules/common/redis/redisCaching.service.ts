import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisSevice } from './redis.service';
import { RedisHashFunctionService } from './redisHashFunction.service';

@Injectable()
export class RedisCachingService {
  private redis: Redis;
  constructor(
    private redisService: RedisSevice,
    private readonly redisHashFunctionService: RedisHashFunctionService,
  ) {
    this.redis = this.redisService.getClients().redis;
  }

  public async setCahe<T>(redisKey: string, data: T[], id: string) {
    try {
      console.log(data);
      if (data && data.length > 0) {
        // Save JSON data in a hash
        await this.redis.hset(`user:${id}`, redisKey, JSON.stringify(data));

        // 10 days TTL
        const TEN_DAYS = 60 * 60 * 24 * 10; // 864000
        await this.redis.expire(`user:${id}`, TEN_DAYS);

        console.log('Cached successfully');
      } else {
        console.log('Empty data, skipping cache');
      }
    } catch (error) {
      throw new Error(
        `Redis cache error: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  public async setExtra_details(data: {
    detail?: unknown;
    id?: string;
    redisKey?: string;
    data?: unknown;
  }) {
    console.log(data);
    switch (data?.detail) {
      case 'save_last_id':
        {
          const cacheData =
            await this.redisHashFunctionService.hSet_setExtra_details(
              data.id || '',
              data.redisKey || '',
              data.data,
            );
          if (!cacheData) {
            console.warn('could not cache-(look in to it)');
          } else {
            console.log('test2->passed');
          }
        }
        break;
    }
  }
}
