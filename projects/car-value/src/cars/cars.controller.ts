import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CarDto, CreateCarDto } from './dtos/car.dto'
import { CarsService } from './cars.service'
import { AuthGuard } from 'src/users/guards/auth.guard'
import { SerializeResponse } from 'src/interceptors/serialize.interceptor'
import { CurrentUser } from 'src/users/decorators/current-user.decorator'
import { User } from 'src/users/user.entity'

@Controller('cars')
@UseGuards(AuthGuard)
export class CarsController {
  constructor(private carsService: CarsService) {}
  @Post()
  @SerializeResponse(CarDto)
  createCar(@Body() body: CreateCarDto, @CurrentUser() user: User) {
    return this.carsService.createCar(body, user)
  }
}
