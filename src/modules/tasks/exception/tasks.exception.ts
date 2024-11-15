import { HttpException, HttpStatus } from '@nestjs/common';

export class DoNotAllow extends HttpException {
  constructor() {
    super('Do Not Allow', HttpStatus.FORBIDDEN);
  }
}
