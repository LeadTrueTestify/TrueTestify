// src/auth/auth.controller.ts
import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('logo'))
  async signup(
    @Body() signupDto: SignupDto,
    @UploadedFile() logo: Express.Multer.File,
  ): Promise<{ token: string }> {
    return this.authService.signup(signupDto, logo);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}