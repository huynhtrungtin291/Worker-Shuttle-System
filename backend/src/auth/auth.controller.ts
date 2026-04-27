import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import type { Request } from 'express';
import { JwtPayload } from '../common/interface/jwtpayload.interface';
// import { AuthGuard } from './guards/auth.guard';
// import { UseGuards } from '@nestjs/common';
// import { Public } from './decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.username, loginDto.password);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Body() _refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    const user = req['user'] as JwtPayload;
    const refreshToken = req['refreshToken'] as string;
    return this.authService.refreshTokens(user.username, refreshToken);
  }

  @Post('logout')
  logout(@Req() req: Request) {
    const user = req['user'] as JwtPayload;
    return this.authService.logout(user.username);
  }

  // @UseGuards(JwtRefreshGuard)
  // @Post('test')
  // test(@Req() req: Request) {
  //   const user: object = req['user']; // Access the user information from the request object
  //   return { message: 'Test endpoint', user };
  // }
}
