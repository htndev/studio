import { AppConfig, JwtStrategyFactory } from '@xbeat/server-toolkit';
import { ApiEndpoint } from '@xbeat/toolkit';

import { UserRepository } from '../../repositories/user.repository';

export const JwtStrategy = JwtStrategyFactory(ApiEndpoint.Studio, UserRepository, AppConfig);
