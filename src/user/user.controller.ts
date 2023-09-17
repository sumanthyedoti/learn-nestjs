import { Controller, Get, UseGuards } from '@nestjs/common';
import {User} from '@prisma/client'

import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user
  }
  @Get('email')
  getEmail(@GetUser('email') email: string) {
    return email
  }
}
