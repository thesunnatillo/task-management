import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const encoded = request.headers.authorization.split(' ')[1];
    const username = Buffer.from(encoded, 'base64')
      .toString('ascii')
      .split(':')[0];

    const user = await this.userRepo.findOne({ where: { username: username } });

    return encoded === user.hash;
  }
}
