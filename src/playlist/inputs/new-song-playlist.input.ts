import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class NewSongPlaylistInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  song: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  playlist: string;
}
