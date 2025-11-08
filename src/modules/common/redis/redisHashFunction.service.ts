import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisSevice } from './redis.service';

@Injectable()
export class RedisHashFunctionService {
  private redis: Redis;
  constructor(private redisService: RedisSevice) {
    this.redis = this.redisService.getClients().redis;
  }
  public async check_if_exits(data: { role: string; id: string }) {
    if (data.role === 'patient') {
      const eistingdata = await this.redis.hexists(
        `patientActiveStatus`,
        data.id,
      );
      if (eistingdata) {
        return true;
      } else if (!eistingdata) {
        return false;
      } else {
        return false;
      }
    } else if (data.role === 'doctor') {
      const eistingdata = await this.redis.hexists(
        `doctorActiveStatus`,
        `${data.id}`,
      );
      if (eistingdata) {
        return true;
      } else if (!eistingdata) {
        return false;
      } else {
        return false;
      }
    } else {
      console.warn('no role provided');
      return false;
    }
  }

  public async return_the_doc(data: { role: string; id: string }) {
    if (data.role === 'patient') {
      try {
        const eistingdata = await this.redis.hget(
          `patientActiveStatus`,
          data.id,
        );
        if (eistingdata) {
          return JSON.parse(eistingdata) as unknown;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.warn(error.message);
          return false;
        }
      }
    } else if (data.role === 'doctor') {
      try {
        const eistingdata = await this.redis.hget(
          `doctorActiveStatus`,
          `${data.id}`,
        );
        if (eistingdata) {
          return JSON.parse(eistingdata) as unknown;
        }
      } catch (error) {
        if (error instanceof Error) {
          console.warn(error.message);
          return false;
        }
      }
    }
  }

  public async push_hash_conversation(data: {
    id: string;
    data: Record<string, unknown>;
  }) {
    const set_Data = await this.redis.hset(
      'conversation',
      data.id,
      JSON.stringify(data.data),
    );
    if (set_Data === 1) {
      console.log('New entry added.');
      return true;
    } else if (set_Data === 0) {
      console.log('Entry updated.');
      return true;
    } else {
      return false;
    }
  }

  public async hExists_setExtra_details(id: string, redisKey: string) {
    const eistingdata = await this.redis.hexists(`user:${id}`, `${redisKey}`);
    if (eistingdata > 0) {
      return true;
    } else {
      return false;
    }
  }

  public async hDelete_setExtra_details(id: string, redisKey: string) {
    const deletedCount = await this.redis.hdel(`user:${id}`, `${redisKey}`);
    if (deletedCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  public async hSet_setExtra_details(
    id: string,
    redisKey: string,
    data: unknown,
  ) {
    const cacheData = await this.redis.hset(
      `user:${id}`,
      `${redisKey}`,
      JSON.stringify({
        data,
      }),
    );
    if (cacheData) {
      return true;
    } else {
      return false;
    }
  }
  public async hGet_hashed_data(id: string, redisKey: string) {
    const data = await this.redis.hget(`user:${id}`, redisKey);
    if (!data) {
      return;
    }
    return JSON.parse(data) as Array<Record<string, unknown>>;
  }
}
