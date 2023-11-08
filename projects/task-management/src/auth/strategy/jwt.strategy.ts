import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Repository } from 'typeorm'
import { User } from '../user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtPayload } from '../types'
import { Injectable } from '@nestjs/common'
import * as config from 'config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt').secret,
    })
  }

  async validate(payload: JwtPayload) {
    const { username } = payload
    const user = await this.userRepository.findOneBy({ username })
    return user
  }
}
