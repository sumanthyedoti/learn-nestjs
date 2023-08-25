import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  signup() {
    return 'Singed up'
  }

  signin() {
    return 'Singed in'
  }
}
