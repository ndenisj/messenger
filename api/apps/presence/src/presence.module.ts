import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { RedisModule, SharedModule } from '@app/shared';
import { CacheModule } from '@nestjs/cache-manager';
import { PresenceGateway } from './presence.gateway';
// import { ConfigModule } from '@nestjs/config';
// import * as Joi from 'joi';

@Module({
  imports: [
    RedisModule,
    CacheModule.register(),
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceGateway],
})
export class PresenceModule {}
