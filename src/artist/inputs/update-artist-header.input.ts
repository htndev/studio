import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateArtistHeaderInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  url: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  header: string;
}
