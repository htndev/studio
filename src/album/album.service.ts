import { ChangeReleaseDate } from './inputs/change-release-date.input';
import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { buildFieldLabels, StatusType, UserJwtPayload } from '@xbeat/server-toolkit';

import { NewSongInput } from '../common/inputs/new-song.input';
import { AlbumType } from '../common/types/album.type';
import { Album } from '../entities/album.entity';
import { Artist } from '../entities/artist.entity';
import { AlbumRepository } from '../repositories/album.repository';
import { ArtistRepository } from '../repositories/artist.repository';
import { FeaturingRepository } from '../repositories/featuring.repository';
import { SongRepository } from '../repositories/song.repository';
import { UserRepository } from '../repositories/user.repository';
import { AlbumsSearchInput } from './inputs/albums-search.input';
import { NewAlbumInput } from './inputs/new-album.input';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumRepository) private readonly albumRepository: AlbumRepository,
    @InjectRepository(SongRepository) private readonly songRepository: SongRepository,
    @InjectRepository(FeaturingRepository) private readonly featuringRepository: FeaturingRepository,
    @InjectRepository(ArtistRepository) private readonly artistRepository: ArtistRepository,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository
  ) {}

  async createAlbum(newAlbumInput: NewAlbumInput, currentUser: UserJwtPayload): Promise<StatusType> {
    const currentArtist = await this.artistRepository.findOne({ url: newAlbumInput.artistUrl });

    if (!currentArtist) {
      throw new BadRequestException(`Artist with url '${newAlbumInput.artistUrl}' not found`);
    }

    const hasUserAccess = await this.artistRepository.isUserOwnerOfArtist(currentUser.id, currentArtist.url);

    if (!hasUserAccess) {
      throw new ConflictException('You cannot create album for this artist');
    }

    const releaseDate =
      newAlbumInput.release === 'now'
        ? new Date()
        : !Number.isNaN(+newAlbumInput.release)
        ? new Date(+newAlbumInput.release)
        : new Date();

    const newAlbum = new Album();

    newAlbum.name = newAlbumInput.name;
    newAlbum.artist = currentArtist;
    newAlbum.cover = newAlbumInput.cover || null;
    newAlbum.released = releaseDate;
    newAlbum.url = await this.albumRepository.generateUrl();

    await newAlbum.save();

    await this.registerSongs(newAlbumInput.songs, newAlbum, currentArtist);

    return {
      status: HttpStatus.ACCEPTED
    };
  }

  private async registerSongs(songs: NewSongInput[], album: Album, artist: Artist): Promise<void> {
    await Promise.all(
      songs.map(async ({ name, file, featuring: feats = [] }) => {
        if (!feats.length) {
          return this.songRepository.createNewSong({ name, file, url: artist.url, album });
        }
        const song = await this.songRepository.createNewSong({
          name,
          file,
          url: artist.url,
          album
        });
        let artists = await Promise.all(feats.map(async url => this.artistRepository.findOne({ url })));
        artists = artists.filter(Boolean);

        await Promise.all(
          artists.map(async artist => {
            await this.featuringRepository.createFeaturing({ song, artist });
          })
        );
      })
    );
  }

  async findAlbums(
    { artist = '', url = '', name = '' }: AlbumsSearchInput,
    user: UserJwtPayload
  ): Promise<AlbumType[]> {
    const label = 'album';
    const query = this.albumRepository
      .createQueryBuilder(label)
      .select(buildFieldLabels(label, ['id', 'name', 'url', 'cover', 'released', 'artistId']));
    const userArtists = await this.artistRepository.findUserArtists(user.id);

    if (artist) {
      const artists = await this.artistRepository.findLikeArtist({ url: artist });
      query.where(`${label}.artistId IN (:...ids)`, { ids: artists.map(({ id }) => id) });
    }

    if (url) {
      query.andWhere(`${label}.url ilike :url`, { url: `%${url}%` });
    }

    if (name) {
      query.andWhere(`${label}.name = :name`, { name });
    }

    let albums = await query.getMany();

    albums = albums.filter(({ artistId, released }) =>
      released > new Date() ? userArtists.find(({ id }) => id === artistId) : true
    );

    return this.formatAlbums(albums);
  }

  async findAlbumById(id: number): Promise<Album> {
    return this.albumRepository.findAlbumById(id);
  }

  async releaseAlbumNow(albumUrl: string, userId: number): Promise<StatusType> {
    const album = await this.albumRepository.findOne({ url: albumUrl });

    if (!album) {
      throw new NotFoundException(`Album with id '${albumUrl}' not found`);
    }

    if (album.artist.userId !== userId) {
      throw new NotFoundException(`Album with id '${albumUrl}' not found`);
    }

    album.released = new Date();

    await album.save();

    return {
      status: HttpStatus.ACCEPTED
    };
  }

  async changeReleaseDate({ releaseDate, albumUrl }: ChangeReleaseDate): Promise<StatusType> {
    if (Number.isNaN(releaseDate)) {
      throw new BadRequestException('Release date should be number timestamp');
    }

    const album = await this.albumRepository.findOne({ url: albumUrl });

    if (!album) {
      throw new NotFoundException(`Album with url '${albumUrl}' not found`);
    }

    album.released = new Date(releaseDate);

    album.save();

    return {
      status: HttpStatus.ACCEPTED
    };
  }

  private formatAlbums(albums: Album[]): AlbumType[] {
    return albums.map(({ id, name, url, cover, released, artistId }) => ({
      id,
      name,
      url,
      cover,
      released: released.toISOString(),
      artistId
    }));
  }
}
