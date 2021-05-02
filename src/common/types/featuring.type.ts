import { Field, ObjectType } from '@nestjs/graphql';

import { ArtistType } from '../../artist/types/artist.type';
import { SongType } from './song.type';

@ObjectType()
export class FeaturingType {
  @Field(() => ArtistType)
  artist: ArtistType;

  @Field(() => SongType)
  song: SongType;
}
