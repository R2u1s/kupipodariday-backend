import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  Unauthorized = 401,
  UserAlreadyExists = 409,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.Unauthorized, 'Неверное имя пользоваетеля или пароль'],
  [ErrorCode.UserAlreadyExists, 'Пользователь уже существует'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.Unauthorized, HttpStatus.UNAUTHORIZED],
  [ErrorCode.UserAlreadyExists, HttpStatus.CONFLICT],
]);