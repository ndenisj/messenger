import { NestFactory } from '@nestjs/core';
import { PresenceModule } from './presence.module';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '@app/shared';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);
  app.enableCors();

  const configService = app.get(ConfigService);

  const sharedService = app.get(SharedService);

  const QUEUE = configService.get('RABBITMQ_PRESENCE_QUEUE');

  app.connectMicroservice<MicroserviceOptions>(
    sharedService.getRmqOptions(QUEUE),
  );

  // app.startAllMicroservices();
  // convert to hybrid micro service
  await app.startAllMicroservices();
  await app.listen(6000);
}
bootstrap();
