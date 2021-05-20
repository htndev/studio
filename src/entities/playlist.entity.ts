import { PlaylistSong } from './playlist-song.entity';
import { User } from './user.entity';
import { PlaylistAvailability } from '../common/constants/playlist.constant';
import { EnhancedBaseEntity } from '@xbeat/server-toolkit';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('playlist')
export class Playlist extends EnhancedBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    default: 'Playlist'
  })
  title: string;

  @Column({
    type: 'varchar',
    unique: true
  })
  @Index()
  url: string;

  @Column({
    type: 'enum',
    enum: PlaylistAvailability,
    default: PlaylistAvailability.Private
  })
  availability: PlaylistAvailability;

  @ManyToOne(
    () => User,
    user => user.playlists,
    { eager: true }
  )
  @JoinColumn()
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany(
    () => PlaylistSong,
    playlistSong => playlistSong.playlist,
    { eager: false }
  )
  playlistSongs: PlaylistSong[];
}
