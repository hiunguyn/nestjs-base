import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLE_KEY } from '@/decorator'
import { RoleStatus } from '@/enums'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RoleStatus[]>(ROLE_KEY, [context.getHandler(), context.getClass()])
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!roles) return true

    return roles.includes(user.roleId)
  }
}
