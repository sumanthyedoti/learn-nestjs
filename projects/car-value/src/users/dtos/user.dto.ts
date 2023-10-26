import { Exclude, Expose } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @MinLength(6)
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  password: string
}

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string

  @IsString()
  @IsOptional()
  password: string
}

export class UserDto {
  @Expose()
  id: string

  @Expose()
  email: string

  @Exclude()
  password: string
}
