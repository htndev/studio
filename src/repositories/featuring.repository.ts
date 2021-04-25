import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Featuring } from '../entities/featuring.entity';

@Injectable()
@EntityRepository(Featuring)
export class FeaturingRepository extends Repository<Featuring> {}
