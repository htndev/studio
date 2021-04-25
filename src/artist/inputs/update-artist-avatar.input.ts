import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateArtistAvatarInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  url: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  avatar: string;
}
