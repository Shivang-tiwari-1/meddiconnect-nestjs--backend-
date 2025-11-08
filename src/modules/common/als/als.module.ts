import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AlsService } from './als.service';
import { AlsMiddleware } from './als.middleware';

@Global()
@Module({
  providers: [AlsService],
  exports: [AlsService],
})
export class AlsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*');
  }
}
