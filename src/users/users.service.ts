import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,QueryFailedError, FindOneOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { HashService } from 'src/hash/hash.service';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userHash = await this.hashService.getUserData(createUserDto);
      return await this.userRepository.save(userHash);
    } catch (err) {
      if (err instanceof QueryFailedError) {
        throw new ServerException(ErrorCode.UserAlreadyExists);
      }
    }
  }

  findOwn (query: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(query);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string):Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async updateById(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  } 

  async removeById(id: number) {
    return this.userRepository.delete({ id });
  }
}
