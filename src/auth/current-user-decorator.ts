import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { UserPayload } from './jwt.strategy.js'

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
  },
)
