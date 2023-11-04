import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './types'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup({ username, password }: AuthCredentialsDto) {
    try {
      return await this.userRepository.save({
        username,
        password: await this.hashPassword(password),
      })
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('User already exists')
      } else {
        throw new InternalServerErrorException('User already exists')
      }
    }
  }

  async signin({ username, password }: AuthCredentialsDto) {
    const user = await this.userRepository.findOneBy({ username })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException()
    }

    const payload: JwtPayload = { username }
    const accessToken = this.jwtService.sign(payload)
    return { accessToken, user }
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10)
  }
}
