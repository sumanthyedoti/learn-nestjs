import { User } from './user.entity';

export type CreateUserFn = (email: string, password: string) => Promise<User>;
