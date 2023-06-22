import { RedisCacheService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { ActiveUser } from './interfaces/ActiveUser.ubterface';

@Injectable()
export class PresenceService {
  constructor(private readonly cache: RedisCacheService) {}
  async getFoo() {
    console.log('NOT CACHED!');
    return { foo: 'bar' };
  }

  async getActiveUser(id: number) {
    const user = await this.cache.get(`user-${id}`);

    return user as ActiveUser | undefined;
  }
}
