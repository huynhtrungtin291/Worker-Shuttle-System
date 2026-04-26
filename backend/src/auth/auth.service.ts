import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../common/interface/jwtpayload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    const passWordUser = await this.usersService.getPasswordByUsername(username);
    if (!user || !passWordUser) {
      console.log('User not found or password not found');
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.usersService.checkPassword(pass, passWordUser);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const result: JwtPayload = {
      username: user.username,
      fullname: user.fullname,
      phone: user.phone,
      role: user.role,
      fcm_token: user.fcm_token ?? null,
    };
    const accessToken = await this.jwtService.signAsync(result);
    return { accessToken: accessToken };
  }
}
