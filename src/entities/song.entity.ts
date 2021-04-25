import { Featuring } from './featuring.entity';
import { Album } from './album.entity';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { MAX_ALBUM_URL_LENGTH } from '../common/constants/common.constant';

@Entity('songs')
export class Song extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: FIELD_LENGTH.SONG.MAX
  })
  name: string;

  @Column()
  file: string;

  @Column({
    type: 'varchar',
    length: MAX_ALBUM_URL_LENGTH
  })
  url: string;

  @OneToOne(
    () => Album,
    album => album.songs
  )
  @JoinColumn()
  album: Album;

  @Column()
  albumId: number;

  @OneToOne(
    () => Featuring,
    feat => feat.song
  )
  featuring: Featuring;
}
