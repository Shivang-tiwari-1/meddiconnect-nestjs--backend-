import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisSevice } from './redis.service';

@Injectable()
export class pubSubService implements OnModuleInit {
  private sub: Redis;
  private pub: Redis;
  private subscribeTo: Array<string>;
  private channel: Array<string>;
  constructor(private readonly redisService: RedisSevice) {
    this.sub = this.redisService.getClients().sub;
    this.pub = this.redisService.getClients().pub;

    this.subscribeTo = [
      'ui_update',
      'chatbox',
      'patient_information_channel',
      'doctor_information_channel',
    ];
    this.channel = [
      'ui_update',
      'is_active_ui_update',
      'chatbox',
      'patient_information_channel',
      'doctor_information_channel',
    ];
  }

  public async publish_patient_channel() {
    for (const data of this.channel) {
      await this.pub.publish(data, `subscribed to channel-(${data})`, (err) => {
        if (err) {
          throw new Error(`could not publish the channel:${err}`);
        } else {
          console.log(`**********channel-published-to-(${data})*************`);
        }
      });
    }
  }

  public async SubscribeChannel() {
    for (const data of this.subscribeTo) {
      await this.sub.subscribe(data, (err, count) => {
        if (err) {
          throw new Error(`could not subscribe to the channel (${data})`);
        } else {
          console.log(`Subscribed to ${count} ${data}`);
        }
      });
    }
  }

  async onModuleInit() {
    await this.publish_patient_channel();
    await this.SubscribeChannel();
  }
}
