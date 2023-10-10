import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { RemoveUserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    if (!email) return null;
    return this.repo.find({ where: { email } });
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOne({ where: { id } });
  }

  async update(id: number, removeUserDto: RemoveUserDto) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new Error('User not found with the id');
    }
    const upatedUser = Object.assign(user, removeUserDto);
    return this.repo.save(upatedUser);
  }

  async remove(id: number) {
    return this.repo.delete({ id });
  }
}
