import { Featuring } from './featuring.entity';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { FIELD_LENGTH, Nullable } from '@xbeat/toolkit';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { MAX_ALBUM_URL_LENGTH } from '../common/constants/common.constant';
import { Artist } from './artist.entity';
import { Song } from './song.entity';

@Entity('albums')
export class Album extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: FIELD_LENGTH.ALBUM.MAX
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  cover: Nullable<string>;

  @Column({
    type: 'varchar',
    length: MAX_ALBUM_URL_LENGTH
  })
  url: string;

  @OneToOne(
    () => Artist,
    artist => artist.albums,
    { eager: true }
  )
  @JoinColumn()
  artist: Artist;

  @Column()
  artistId: number;

  @OneToMany(
    () => Song,
    song => song.album
  )
  songs: Song[];
}
