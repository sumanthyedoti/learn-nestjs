import { Injectable, NotFoundException } from '@nestjs/common'
import { ApproveCarDto, CreateCarDto, GetCarValueDto } from './dtos/car.dto'
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

  async approveCar(id: number, isApproved: boolean) {
    const car = await this.repo.findOne({ where: { id } })
    if (!car) {
      throw new NotFoundException('Car does not exist')
    }
    car.approved = isApproved
    return this.repo.save(car)
  }

  getEstimate({ make, model, year, mileage, lat, lng }: GetCarValueDto) {
    const query = this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'estimatedPrice')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('year - :year BETWEEN -5 AND 5', { year })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN -3 AND 3', { lng })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
    return query.getRawOne()
  }
}
