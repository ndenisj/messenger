import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {
  ConversationsRepository,
  FriendRequestEntity,
  MessagesRepository,
  PostgresDBModule,
  RedisModule,
  SharedModule,
  UserEntity,
  ConversationEntity,
  MessageEntity,
} from '@app/shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    PostgresDBModule,
    RedisModule,
    SharedModule.registerRMQ('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRMQ(
      'PRESENCE_SERVICE',
      process.env.RABBITMQ_PRESENCE_QUEUE,
    ),
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      MessageEntity,
      ConversationEntity,
    ]),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'ConversationRepositoryInterface',
      useClass: ConversationsRepository,
    },
    {
      provide: 'MessagesRepositoryInterface',
      useClass: MessagesRepository,
    },
  ],
})
export class ChatModule {}
