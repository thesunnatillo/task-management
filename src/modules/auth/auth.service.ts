import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { LoginAlreadyUsed, UsernameOrPasswordWrong } from './exception/auth.exception';
import { LogInI, SignUpI } from './interfaces/auth.i';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async signup(signUpDto: SignupDto): Promise<SignUpI> {
    const user = await this.usersRepo.findOne({
      where: { username: signUpDto.username },
    });

    if (user) {
      throw new LoginAlreadyUsed();
    }
    const encoded = Buffer.from(
      `${signUpDto.username}:${signUpDto.password}`,
    ).toString('base64');
    const newUser = {
      ...signUpDto,
      hash: encoded,
    };

    const savedUser = await this.usersRepo.save(newUser);

    return {
      encoded: savedUser.hash,
    };
  }

  async login(logInDto: LogInDto): Promise<LogInI> {
    const user = await this.usersRepo.findOne({
      where: { username: logInDto.username },
    });
    if (!user) {
      throw new UsernameOrPasswordWrong();
    }
    const decode = Buffer.from(user.hash, 'base64').toString('ascii');
    const password = decode.split(':')[1];

    if (password !== logInDto.password) {
      throw new UsernameOrPasswordWrong();
    }

    return {
      message: 'Done!',
    };
  }
}
