import { BadRequestException, NotFoundException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import {promisify} from "node:util"
import {scrypt as _scrypt, randomBytes} from "node:crypto"

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) { }
  async signup(email: string, password: string) {
    const users = await this.userService.findByEmail(email)
    if(users.length) {
      throw new BadRequestException('email already taken')
    }
    const salt = randomBytes(8).toString('hex')
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer
    const hash = hashBuffer.toString('hex')
    const hashedPassword = hash + '.' + salt
    return this.userService.create(email, hashedPassword)
  }

  async signin(email: string, password: string) {
    const users = await this.userService.findByEmail(email)
    if(!users.length) {
      throw new NotFoundException('email or password does not match')
    }
    const [user] = users
    const [hashedPassword, salt] = user.password.split('.')
    const hash = (await scrypt(password, salt, 32)) as Buffer
    if(hash.toString('hex') !== hashedPassword) {
      throw new NotFoundException('email or password does not match')
    }
    return user
  }
}
