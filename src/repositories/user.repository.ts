import { UserSearchInput } from './../user/types/user-search.input';
import { QueryResult } from './../common/constants/type.constant';
import { Maybe } from '@xbeat/toolkit';
import { BadRequestException, Injectable } from '@nestjs/common';
import { buildFieldLabels } from '@xbeat/server-toolkit';
import { EntityRepository, Repository } from 'typeorm';

import { AllowedUserFields } from '../common/constants/type.constant';
import { User } from '../entities/user.entity';

@Injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  readonly label = 'user';
  readonly defaultReturnFields: AllowedUserFields[] = ['id', 'email', 'username'];

  async findUserById<F extends AllowedUserFields>(id: number, fields?: F[]): Promise<QueryResult<User, F>> {
    return this.createQueryBuilder(this.label)
      .select(buildFieldLabels(this.label, fields ?? this.defaultReturnFields))
      .where('id = :id', { id })
      .getOne();
  }

  async findUsersLike({ email, username }: UserSearchInput): Promise<User[]> {
    if (!email && !username) {
      throw new BadRequestException('Email or username should be provided');
    }
    const query = this.createQueryBuilder(this.label).select(buildFieldLabels(this.label, this.defaultReturnFields));

    if (email) {
      query.where('email = :email', { email });
    }

    if (username) {
      query.andWhere('username = :username', { username });
    }

    return query.getMany();
  }
}
