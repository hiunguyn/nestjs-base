import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { User as UserEntity } from '@/entities'

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user as UserEntity

    return data ? user?.[data] : user
  },
)
