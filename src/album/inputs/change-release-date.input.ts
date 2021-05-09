import { MAX_ALBUM_URL_LENGTH } from './../../common/constants/common.constant';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

@InputType()
export class ChangeReleaseDate {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  releaseDate: number;

  @Field()
  @IsString()
  @Length(MAX_ALBUM_URL_LENGTH, MAX_ALBUM_URL_LENGTH)
  albumUrl: string;
}
