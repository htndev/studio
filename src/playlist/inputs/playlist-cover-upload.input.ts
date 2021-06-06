import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class PlaylistCoverUpload {
  @Field()
  @IsNotEmpty()
  @IsString()
  cover: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  playlist: string;
}
