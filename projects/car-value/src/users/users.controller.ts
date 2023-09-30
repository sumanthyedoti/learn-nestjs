import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto, RemoveUserDto, UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { SerializeResponse } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
@SerializeResponse(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password)
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id))
    if(!user) {
      throw new NotFoundException("User not found with the id")
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
  async updateUser(@Param('id') id: string, @Body() removeUserDto: RemoveUserDto) {
    const user = await this.userService.update(parseInt(id), removeUserDto)
    if(!user) {
      throw new NotFoundException("User not found with the id")
    }
    return user
  }
}
