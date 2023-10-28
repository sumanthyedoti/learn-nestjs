import { Injectable } from '@nestjs/common'
import { CreateCarDto } from './dtos/car.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Car } from './car.entity'
import { User } from 'src/users/user.entity'

@Injectable()
export class CarsService {
  constructor(@InjectRepository(Car) private repo: Repository<Car>) {}
  createCar(createCarDto: CreateCarDto, user: User) {
    const car = this.repo.create(createCarDto)
    car.user = user
    return this.repo.save(car)
  }
}
