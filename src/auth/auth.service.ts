import { HttpStatus, Injectable } from '@nestjs/common'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { SignInDto, SignupDto } from './dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  async signup(dto: SignupDto) {
    try {
      const hash = await argon.hash(dto.password)
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          age: parseInt(dto.age),
          hash,
          name: dto.name
        },
        select: {
          id: true,
          createdAt: true,
          email: true,
        }
      })
      return {
        message: "Created user",
        data: user
      }
    } catch (err) {
      console.log(err)
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return {
            statusCode: HttpStatus.FORBIDDEN,
            message: "Credentials already taken",
            error: "Forbidden"
          }
        }
      }
      throw err;
    }
  }

  async signin(dto: SignInDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email
        }
      })
      if (!user) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: "Credentials incorrent",
          error: "Forbidden"
        }
      }
      const isCorrectPassword = await argon.verify(user.hash, dto.password)
      if (!isCorrectPassword) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          message: "Credentials incorrent",
          error: "Forbidden"
        }
      }
      delete user.hash
      return user
    } catch (err) {
      console.log(err)
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Something went wrong",
      }

    }
  }
}
