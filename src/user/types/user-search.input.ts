import { Field, InputType } from '@nestjs/graphql';
import { FIELD_LENGTH, usernameRegexp } from '@xbeat/toolkit';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

@InputType()
export class UserSearchInput {
  @Field()
  @IsOptional()
  @IsString()
  @MinLength(FIELD_LENGTH.USERNAME.MIN)
  @Matches(usernameRegexp(), { message: 'Username does not fit pattern' })
  username: string;

  @Field()
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}
