import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class HashService {
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getUserData<T extends { password?: string }>(
    createUserDto: T,
  ): Promise<Omit<T, 'password'> & { password: string }>  {
    const { password, ...rest } = createUserDto;
    const hashPassword = await this.hashPassword(password);
    return {
      ...rest,
      password: hashPassword,
    };
  }
}