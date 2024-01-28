import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  BadRequestAlreadyExistsUser,
  BadRequestAlreadyExistsEmail,
  BadRequestAlreadyExistsWish,
  Unauthorized,
  NotFoundUser,
  NotFoundWishes,
  ConflictAlreadyExistsUser,
  ConflictAlreadyExistsWish
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.BadRequestAlreadyExistsUser, 'Пользователь с таким именем уже существует'],
  [ErrorCode.BadRequestAlreadyExistsEmail, 'Пользователь с таким E-mail уже существует'],
  [ErrorCode.BadRequestAlreadyExistsWish, 'Подарок с таким именем уже существует'],
  [ErrorCode.Unauthorized, 'Неверное имя пользоваетеля или пароль'],
  [ErrorCode.NotFoundUser, 'Пользователь не найден'],
  [ErrorCode.NotFoundWishes, 'Подарки не найдены'],
  [ErrorCode.ConflictAlreadyExistsUser, 'Пользователь уже существует'],
  [ErrorCode.ConflictAlreadyExistsWish, 'Подарок уже существует']
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.BadRequestAlreadyExistsUser, HttpStatus.BAD_REQUEST],
  [ErrorCode.BadRequestAlreadyExistsEmail, HttpStatus.BAD_REQUEST],
  [ErrorCode.BadRequestAlreadyExistsWish, HttpStatus.BAD_REQUEST],
  [ErrorCode.Unauthorized, HttpStatus.UNAUTHORIZED],
  [ErrorCode.NotFoundUser, HttpStatus.NOT_FOUND],
  [ErrorCode.NotFoundWishes, HttpStatus.NOT_FOUND],
  [ErrorCode.ConflictAlreadyExistsUser, HttpStatus.CONFLICT],
  [ErrorCode.ConflictAlreadyExistsWish, HttpStatus.CONFLICT]
]);