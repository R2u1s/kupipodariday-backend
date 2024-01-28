import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  NotFoundUser = 404,
  NotFoundWishes = 404,
  AlreadyExistsUser = 409,
  AlreadyExistsWish = 409
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.BadRequest, 'Некорректные данные'],
  [ErrorCode.Unauthorized, 'Неверное имя пользоваетеля или пароль'],
  [ErrorCode.NotFoundUser, 'Пользователь не найден'],
  [ErrorCode.NotFoundWishes, 'Подарки не найдены'],
  [ErrorCode.AlreadyExistsUser, 'Пользователь уже существует'],
  [ErrorCode.AlreadyExistsWish, 'Подарок уже существует'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.BadRequest, HttpStatus.BAD_REQUEST],
  [ErrorCode.Unauthorized, HttpStatus.UNAUTHORIZED],
  [ErrorCode.NotFoundUser, HttpStatus.NOT_FOUND],
  [ErrorCode.NotFoundWishes, HttpStatus.NOT_FOUND],
  [ErrorCode.AlreadyExistsUser, HttpStatus.CONFLICT],
  [ErrorCode.AlreadyExistsWish, HttpStatus.CONFLICT],
]);