import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  signup(@Body() signUpDto: SignupDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('login')
  login(@Body() logInDto: LogInDto) {
    return this.authService.login(logInDto);
  }
}
