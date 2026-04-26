// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserActor } from '../../common/enums/actor.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserActor[]) => SetMetadata(ROLES_KEY, roles);
