import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerException } from 'src/exceptions/server.exception';
import { ErrorCode } from 'src/exceptions/error-codes';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(userId: number, createOfferDto: CreateOfferDto) {
    const { itemId, amount } = createOfferDto;

    const wish = await this.wishesService.getWishById(itemId);

    //Если id пользователя совпадает с id владельца подарка - ошибка
    if (userId === wish.owner.id) {
      throw new ServerException(ErrorCode.ForbiddenOffer);
    }

    const raisedSum = Number(wish.raised) + Number(amount);

    //Если сумма превышает стоимость подарка - ошибка
    if (raisedSum > wish.price) {
      throw new ServerException(ErrorCode.ForbiddenRaised);
    }

    //Обновляем информацию о подарке (поле raised)
    await this.wishesService.updateRaised(itemId, {
      raised: raisedSum,
    });

    //Сохраняем новое предложение
    return await this.offersRepository.save({
      ...createOfferDto,
      wish,
      userId,
    });
  }

  async findAll() {
    const offers = await this.offersRepository.find({
      relations: { user: true, item: true },
    });
    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.find({
      where: { id },
      relations: { user: true, item: true },
    });
    return offer;
  }
}
