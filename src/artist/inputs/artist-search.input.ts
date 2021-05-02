import { MAX_ARTIST_URL_LENGTH } from '../../common/constants/common.constant';
import { InputType } from '@nestjs/graphql';
import { OptionalField } from '@xbeat/server-toolkit';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ArtistSearchInput {
  @OptionalField()
  @IsOptional()
  @IsString()
  @MinLength(FIELD_LENGTH.ARTIST.MIN)
  @MaxLength(FIELD_LENGTH.ARTIST.MAX)
  name: string;

  @OptionalField()
  @IsOptional()
  @IsString()
  @Length(1, MAX_ARTIST_URL_LENGTH)
  url: string;
}
