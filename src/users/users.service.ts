import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, FindOneOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { hashValue,verifyHash } from 'src/helpers/hash';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    try {
      const userHash = await this.userRepository.create({
        ...createUserDto,
        password: await hashValue(password)
      });
      return await this.userRepository.save(userHash);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new ServerException(ErrorCode.AlreadyExistsUser);
      }
    }
  }

  findOwn(query: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(query);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);
    if (password) {
      updateUserDto.password = await hashValue(password);
    }
    return this.userRepository.save({...user, ...updateUserDto});
  }

  async removeById(id: number) {
    return this.userRepository.delete({ id });
  }
}
