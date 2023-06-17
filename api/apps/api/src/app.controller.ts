import { AuthGuard, UserInterceptor, UserRequest } from '@app/shared';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  // AUTH MICRO-SERVICE
  @Get('auth')
  async getUsers() {
    return this.authService.send({ cmd: 'get-users' }, {});
  }

  @Post('auth/register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService
      .send(
        { cmd: 'register' },
        {
          firstName,
          lastName,
          email,
          password,
        },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @Post('auth/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService
      .send(
        { cmd: 'login' },
        {
          email,
          password,
        },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Post('add-friend/:friendId')
  async addFriend(
    @Req() req: UserRequest,
    @Param('friendId') friendId: number,
  ) {
    if (!req?.user) {
      throw new BadRequestException();
    }

    return this.authService
      .send(
        {
          cmd: 'add-friend',
        },
        {
          userId: req.user.id,
          friendId,
        },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  @Get('get-friends')
  async getFriends(@Req() req: UserRequest) {
    if (!req?.user) {
      throw new BadRequestException();
    }

    return this.authService
      .send(
        {
          cmd: 'get-friends',
        },
        {
          userId: req.user.id,
        },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  // PRESENCE MICRO-SERVICE
  @UseGuards(AuthGuard)
  @Get('presence')
  async getPresence() {
    return this.presenceService
      .send({ cmd: 'get-presence' }, {})
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}
