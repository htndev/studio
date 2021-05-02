import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Artist } from './artist.entity';
import { Song } from './song.entity';

@Entity('featuring')
export class Featuring extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Artist,
    artist => artist.featuring,
    { eager: true }
  )
  @JoinColumn()
  artist: Artist;

  @Column()
  artistId: number;

  @ManyToOne(
    () => Song,
    song => song.featuring,
    { eager: true }
  )
  @JoinColumn()
  song: Song;

  @Column()
  songId: number;
}
