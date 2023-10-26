import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { BadRequestException, NotFoundException } from '@nestjs/common'

describe('AuthService', () => {
  let service: AuthService
  let fakeUsersService: Partial<UsersService>
  beforeEach(async () => {
    const users: User[] = []
    fakeUsersService = {
      findByEmail: (email) =>
        Promise.resolve(users.filter((u) => u.email === email)),
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email: email,
          password: password,
        } as User
        users.push(user)
        return Promise.resolve(user)
      },
    }
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile()

    service = module.get(AuthService)
  })

  it('can create an instace of auth-service', async () => {
    expect(service).toBeDefined()
  })

  it('creates a new user with salted and hashed password', async () => {
    const PASSWORD = 'userpassword'
    const user = await service.signup('user@gmail.com', PASSWORD)
    expect(user.password).not.toEqual(PASSWORD)
    const [hash, salt] = user.password.split('.')
    expect(hash).toBeDefined()
    expect(hash).not.toEqual(PASSWORD)
    expect(salt).toBeDefined()
  })

  it('signup throws error if email already exists', async () => {
    await service.signup('asdf@asdf.com', 'password')
    await expect(service.signup('asdf@asdf.com', 'password23')).rejects.toThrow(
      BadRequestException,
    )
  })

  it('signin throws error if email is unused', async () => {
    await expect(service.signin('asdf@asdf.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    )
  })

  it('signin throws error if password does not match', async () => {
    await service.signup('asdf@asdf.com', 'password')
    await expect(
      service.signin('asdf@asdf.com', 'wrongpassword'),
    ).rejects.toThrow(NotFoundException)
  })

  it('signin: returns user if password matched', async () => {
    await service.signup('asdf@asdf.com', 'password')
    const user = await service.signin('asdf@asdf.com', 'password')
    expect(user).toBeDefined()
  })
})
