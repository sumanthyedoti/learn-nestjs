import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common'

import {
  CreateUserDto,
  UpdateUserDto,
  SignInUserDto,
  UserDto,
} from './dtos/user.dto'
import { UsersService } from './users.service'
import { SerializeResponse } from '../interceptors/serialize.interceptor'
import { AuthService } from './auth.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { User } from './user.entity'
import { AuthGuard } from './guards/auth.guard'

@Controller('auth')
@SerializeResponse(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authSerive: AuthService,
  ) {}

  @Post('/signup')
  async signupUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authSerive.signup(body.email, body.password)
    session.userId = user.id
    return user
  }

  @Post('/signin')
  async signinUser(
    @Body() { email, password }: SignInUserDto,
    @Session() session: any,
  ) {
    const user = await this.authSerive.signin(email, password)
    session.userId = user.id
    return user
  }

  @Post('/signout')
  async signOutUser(@Session() session: any) {
    session.userId = null
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: User) {
    return user
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id))
    if (!user) {
      throw new NotFoundException('User not found with the id')
    }
    return user
  }

  @Get()
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email)
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id))
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() removeUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(parseInt(id), removeUserDto)
    if (!user) {
      throw new NotFoundException('User not found with the id')
    }
    return user
  }
}
