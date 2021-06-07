import { PlaylistAvailability } from '@xbeat/toolkit';
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdatePlaylistAvailabilityInput {
  @Field()
  @IsNotEmpty()
  @IsNumber()
  availability: PlaylistAvailability;

  @Field()
  @IsNotEmpty()
  @IsString()
  playlist: string;
}
