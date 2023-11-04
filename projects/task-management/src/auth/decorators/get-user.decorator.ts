import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from '../user.entity'

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    if (data) {
      return request.user[data]
    }
    return request.user // patched by passport/middleware/interceptor
  },
)
