import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { SerializeResponse } from 'src/interceptors/serialize.interceptor'
import { CurrentUser } from 'src/users/decorators/current-user.decorator'
import { AdminGuard } from 'src/users/guards/admin.guard'
import { AuthGuard } from 'src/users/guards/auth.guard'
import { User } from 'src/users/user.entity'
import { CarsService } from './cars.service'
import {
  ApproveCarDto,
  CarDto,
  CreateCarDto,
  GetCarValueDto,
} from './dtos/car.dto'

@Controller('cars')
@UseGuards(AuthGuard)
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Post()
  @SerializeResponse(CarDto)
  createCar(@Body() body: CreateCarDto, @CurrentUser() user: User) {
    return this.carsService.createCar(body, user)
  }

  @Get()
  getEstimate(@Query() query: GetCarValueDto) {
    return this.carsService.getEstimate(query)
  }

  @Patch('/:id/approve')
  @UseGuards(AdminGuard)
  approveCar(@Param('id') id: string, @Body() approveCarDto: ApproveCarDto) {
    return this.carsService.approveCar(parseInt(id), approveCarDto.approved)
  }
}
