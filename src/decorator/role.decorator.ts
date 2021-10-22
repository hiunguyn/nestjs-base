import { SetMetadata } from '@nestjs/common'

import { RoleStatus } from '@/enums'

export const ROLE_KEY = 'roles'
export const Roles = (...roles: RoleStatus[]) => SetMetadata('roles', roles)
