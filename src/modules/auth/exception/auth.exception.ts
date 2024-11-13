import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginAlreadyUsed extends HttpException {
  constructor() {
    super('Bu username band', HttpStatus.BAD_REQUEST);
  }
}

export class UsernameOrPasswordWrong extends HttpException {
  constructor() {
    super('Username yoki Password xato!', HttpStatus.FORBIDDEN);
  }
}