import { UserSearchInput } from './types/user-search.input';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maybe } from '@xbeat/toolkit';

import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: UserRepository) {}

  async hasUserArtist(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return !!user.artists.length;
  }

  async findUserById(id: number): Promise<Maybe<Pick<User, 'id' | 'username' | 'email'>>> {
    return this.userRepository.findUserById(id);
  }

  async findUsersLike(searchCriteria: UserSearchInput): Promise<User[]> {
    return this.userRepository.findUsersLike(searchCriteria);
  }
}
