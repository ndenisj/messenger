import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  FriendRequestEntity,
  UserEntity,
  UserJwt,
  UserRepositoryInterface,
  FriendRequestsRepository,
} from '@app/shared';
import * as bcrypt from 'bcrypt';
import { NewUserDTO } from './dtos/new-user.dto';
import { ExistingUserDTO } from './dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { AuthServiceInterface } from './interface/auth.service.interface';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('FriendRequestsRepositoryInterface')
    private readonly friendRequestRepository: FriendRequestsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOneById(id);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    });
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneById(id);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDTO>): Promise<UserEntity> {
    const { firstName, lastName, email, password } = newUser;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new RpcException(new ConflictException('Email already exists!'));
    }

    const hashedPassword = await this.hashPassword(password);

    const savedUser = await this.userRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    delete savedUser.password;

    return savedUser;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    const doesUserExist = !!user; // if user exist it will return with something else it will return null

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return user;
  }

  async login(existingUser: Readonly<ExistingUserDTO>) {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new RpcException(new UnauthorizedException());
    }

    delete user.password;

    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt, user };
  }

  async verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }> {
    if (!jwt) {
      throw new RpcException(new UnauthorizedException());
    }

    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt);

      return { user, exp };
    } catch (error) {
      throw new RpcException(new UnauthorizedException());
    }
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) return;

    try {
      return this.jwtService.decode(jwt) as UserJwt;
    } catch (error) {
      throw new RpcException(new BadRequestException());
    }
  }

  async addFriend(
    userId: number,
    friendId: number,
  ): Promise<FriendRequestEntity> {
    const creator = await this.findById(userId);
    const receiver = await this.findById(friendId);

    return await this.friendRequestRepository.save({
      creator,
      receiver,
    });
  }

  async getFriends(userId: number): Promise<FriendRequestEntity[]> {
    const creator = await this.findById(userId);

    return await this.friendRequestRepository.findWithRelations({
      where: [{ creator }, { receiver: creator }],
      relations: ['creator', 'receiver'],
    });
  }

  async getFriendsList(userId: number) {
    const friendRequests = await this.getFriends(userId);

    if (!friendRequests) return [];

    const friends = friendRequests.map((friendRequest) => {
      const isUserCreator = userId === friendRequest.creator.id;
      const friendDetails = isUserCreator
        ? friendRequest.receiver
        : friendRequest.creator;

      const { id, firstName, lastName, email } = friendDetails;

      return {
        id,
        email,
        firstName,
        lastName,
      };
    });

    return friends;
  }
}
