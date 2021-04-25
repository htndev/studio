import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Song } from '../entities/song.entity';

@Injectable()
@EntityRepository(Song)
export class SongRepository extends Repository<Song> {}
