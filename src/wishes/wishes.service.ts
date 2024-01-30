import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number): Promise<Wish> {
    const owner = await this.usersService.findById(userId);
    const wish = await this.wishRepository.create({ ...createWishDto, owner });

    return this.wishRepository.save(wish);
  }

  async findUserWishesById(ownerId: number) {
    return await this.wishRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner'],
    });
  }

  async getWishById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { offers: true, owner: true },
    });
    if (!wish) {
      throw new ServerException(ErrorCode.NotFoundWishes);
    }
    return wish;
  }

  //Поиск последних 40 подарков
  async lastWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  //Поиск 20 популярных подарков
  async topWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  //Удаление подарка
  async removeOne(wishId: number, userId: number) {
    const wish = await this.getWishById(wishId);

    if (userId !== wish.owner.id) {
      throw new ServerException(ErrorCode.ForbiddenNotOwner);
    }

    return await this.wishRepository.delete(wishId);
  }

  //Копирование подарка
  async copy(wishId: number, user: User) {
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (user.id === wish.owner.id) {
      throw new ServerException(ErrorCode.ForbiddenOwnWish);
    }

    const createWishDto: CreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    await this.create(createWishDto, user.id);
    await this.wishRepository.increment({ id: wishId }, 'copied', 1);
  }

  //Обновление информации о набронной сумме
  async updateRaised(wishId: number, updateData: UpdateWishDto) {
    console.log(updateData);
    return await this.wishRepository.update(wishId, updateData);
  }
}
