import { Global, Module } from '@nestjs/common';
import { RedisSevice } from './redis.service';
import { pubSubService } from './pubSubService';
import { RedisCachingService } from './redisCaching.service';
import { RedisHashFunctionService } from './redisHashFunction.service';
@Global()
@Module({
  providers: [
    RedisSevice,
    pubSubService,
    RedisCachingService,
    RedisHashFunctionService,
  ],
  exports: [
    RedisSevice,
    pubSubService,
    RedisCachingService,
    RedisHashFunctionService,
  ],
})
export class RedisModule {}
