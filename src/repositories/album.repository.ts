import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Album } from '../entities/album.entity';

@Injectable()
@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {}
