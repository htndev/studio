import { PlaylistSong } from './playlist-song.entity';
import { PlaylistService } from '..//playlist/playlist.service';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { MAX_ALBUM_URL_LENGTH } from '../common/constants/common.constant';
import { Album } from './album.entity';
import { Featuring } from './featuring.entity';

@Entity('songs')
export class Song extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: FIELD_LENGTH.SONG.MAX
  })
  @Index()
  name: string;

  @Column()
  file: string;

  @Column({
    type: 'varchar',
    length: MAX_ALBUM_URL_LENGTH
  })
  @Index()
  url: string;

  @ManyToOne(
    () => Album,
    album => album.songs,
    { eager: true }
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

  @OneToMany(
    () => PlaylistSong,
    playlistSong => playlistSong.song,
    { eager: false }
  )
  songInPlaylist: PlaylistSong;
}
