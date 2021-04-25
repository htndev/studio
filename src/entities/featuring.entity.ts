import { Song } from './song.entity';
import { Artist } from './artist.entity';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('featuring')
export class Featuring extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => Artist,
    artist => artist.featuring,
    { eager: true }
  )
  artist: Artist;

  @OneToOne(
    () => Song,
    song => song.featuring,
    { eager: true }
  )
  song: Song;
}
