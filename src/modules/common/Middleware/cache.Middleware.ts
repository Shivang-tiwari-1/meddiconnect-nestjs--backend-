import { Injectable, NestMiddleware } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisSevice } from '../redis/redis.service';
import { AlsService } from '../als/als.service';
import { SuccessResponse } from 'src/common/utils/custom-response';
import { RedisHashFunctionService } from '../redis/redisHashFunction.service';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  private redis: Redis;
  constructor(
    private redisService: RedisSevice,
    private readonly redisHashFunctionService: RedisHashFunctionService,
    private readonly als: AlsService,
  ) {
    this.redis = this.redisService.getClients().redis;
  }

  async use(req: any, res: any, next: (error?: any) => void) {
    const { redisKey } = req.query as { redisKey?: string };
    if (!redisKey || redisKey === undefined) {
      console.log('redis query query missing');
      next();
    }
    const data = await this.redis.hget(
      `user:${this.als.getUserId()}`,
      `${redisKey}`,
    );
    if (data !== null) {
      if (Object.keys(data)?.length !== 0) {
        return SuccessResponse('cached data', JSON.parse(data));
      } else {
        console.log('empty data ');
        next();
      }
    } else {
      console.log('Cache miss ');
      console.log('|||');
    }

    next();
  }
}
