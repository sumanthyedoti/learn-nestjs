import { Test } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User } from './user.entity'
import { AuthService } from './auth.service'

describe('UserController', () => {
  let controller: UsersController
  let fakeUsersService: Partial<UsersService>
  let fakeAuthService: Partial<AuthService>
  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id) =>
        Promise.resolve({
          id,
          email: 'user@gmail.com',
          password: 'password',
        } as User),
      findByEmail: (email) =>
        Promise.resolve([{ id: 1, email, password: 'kjsdfhl' } as User]),
      // update: (id, updateUserDto) => {},
      // remove: (id) => {},
    }
    fakeAuthService = {
      // signup: (email, password) => {},
      signin: (email, password) => {
        return Promise.resolve({ id: 1, email, password } as User)
      },
    }
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', async () => {
    expect(controller).toBeDefined()
  })

  it('signin: updates session object and returns user', async () => {
    const session = { userId: -1 }
    const user = await controller.signinUser(
      { email: 'user@gmail.com', password: 'sdlfjk' },
      session,
    )
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })
})
