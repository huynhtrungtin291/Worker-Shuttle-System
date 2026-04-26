import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { Body, Controller, Post } from '@nestjs/common';
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

  // @UseGuards(AuthGuard)
  // @Public()
  // @Post('test')
  // test(@Req() req: Request) {
  //   const user: object = req['user']; // Access the user information from the request object
  //   return { message: 'Test endpoint', user };
  // }
}
