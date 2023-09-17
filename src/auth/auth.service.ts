import { HttpStatus, Injectable } from '@nestjs/common'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { SignInDto, SignInResponseDto, SignupDto } from './dto'
import { Prisma } from '@prisma/client'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }
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
      return this.signToken(user.id, user.email)
    } catch (err) {
      console.log(err)
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Something went wrong",
      }

    }
  }

  private async signToken(userId: number, email:string): Promise<SignInResponseDto> {
    const payload = {
      sub: userId,
      email,
    }
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get("JWT_SECRET")
    })
    return {
      access_token: token
    }
  }
}
