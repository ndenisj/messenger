import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  async getFoo() {
    console.log('NOT CACHED!');
    return { foo: 'bar' };
  }
}
