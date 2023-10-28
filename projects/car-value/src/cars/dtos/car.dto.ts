import { Expose, Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsLatitude,
  IsLongitude,
  Max,
  Min,
} from 'class-validator'

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  make: string

  @IsString()
  @IsNotEmpty()
  model: string

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number

  @IsNumber()
  @Min(1900)
  @Max(2050)
  year: number

  @IsLongitude()
  @IsNotEmpty()
  lng: number

  @IsLatitude()
  @IsNotEmpty()
  lat: number

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number
}

export class CarDto {
  @Expose()
  id: string
  @Expose()
  make: string
  @Expose()
  model: string
  @Expose()
  price: number
  @Expose()
  year: number
  @Expose()
  lng: number
  @Expose()
  lat: number
  @Expose()
  mileage: number

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number
}
