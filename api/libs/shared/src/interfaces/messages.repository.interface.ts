/* eslint-disable @typescript-eslint/no-empty-interface */

import { MessageEntity } from '../entities/message.entity';
import { BaseInterfaceRepository } from '@app/shared';

export interface MessagesRepositoryInterface
  extends BaseInterfaceRepository<MessageEntity> {}
