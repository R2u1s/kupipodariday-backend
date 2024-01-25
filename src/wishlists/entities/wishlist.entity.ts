import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { IsInt, IsString, Min, Length, IsUrl, MaxLength } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist {
  // поле id
  @IsInt()
  @Min(0)
  @PrimaryGeneratedColumn()
  id: number;

  // поле createdAt
  @CreateDateColumn()
  createdAt: Date;

  // поле updatedAt
  @UpdateDateColumn()
  updatedAt: Date;

  // поле name. Название списка
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  // поле description. Описание подборки
  @Column()
  @IsString()
  @MaxLength(1500)
  description: string;

  // поле image. Ссылка на изображение обложки для подборки
  @Column()
  @IsUrl()
  image: string;

  // поле wishes. Список желаемых подарков
  @OneToMany(() => Wish, (wish) => wish.name)
  items: Wish[];

  // поле owner. Ссылка на владельца списка
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
