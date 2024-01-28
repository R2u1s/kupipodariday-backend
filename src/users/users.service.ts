import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, FindOneOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { HashService } from 'src/hash/hash.service';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const userHash = await this.hashService.getUserData(createUserDto);
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

  async updateById(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const newUserData = updateUserDto.hasOwnProperty('password')
      ? await this.hashService.getUserData(updateUserDto)
      : updateUserDto;
    const user = await this.userRepository.update(id, newUserData);
    if (!user) {
      throw new ServerException(ErrorCode.BadRequest);
    }
    return this.findById(id);
  }

  async removeById(id: number) {
    return this.userRepository.delete({ id });
  }
}
