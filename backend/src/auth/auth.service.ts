import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from '../common/interface/jwtpayload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { User } from '../users/schema/user.schema';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';
  private readonly refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES as StringValue | undefined) || '7d';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    if ((await this.usersService.isActive(username)) === false) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }
    const passWordUser = await this.usersService.getPasswordByUsername(username);
    if (!user || !passWordUser) {
      console.log('User not found or password not found');
      throw new UnauthorizedException();
    }

    const isPasswordValid = await this.usersService.checkPassword(pass, passWordUser);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const result = this.buildPayload(user);
    const tokens = await this.generateTokenPair(result);
    await this.storeRefreshTokenHash(username, tokens.refreshToken);

    return tokens;
  }

  async logout(username: string): Promise<{ message: string }> {
    await this.usersService.clearRefreshTokenHash(username);
    return { message: 'Dang xuat thanh cong' };
  }

  async refreshTokens(username: string, refreshToken: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    if ((await this.usersService.isActive(username)) === false) {
      throw new UnauthorizedException('Tai khoan da bi khoa');
    }

    const storedHash = await this.usersService.getRefreshTokenHashByUsername(username);
    if (!storedHash) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    const isRefreshTokenValid = await this.usersService.checkPassword(refreshToken, storedHash);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    const payload = this.buildPayload(user);
    const tokens = await this.generateTokenPair(payload);
    await this.storeRefreshTokenHash(username, tokens.refreshToken);

    return tokens;
  }

  private buildPayload(user: User): JwtPayload {
    return {
      username: user.username,
      fullname: user.fullname,
      phone: user.phone,
      role: user.role,
      fcm_token: user.fcm_token ?? null,
    };
  }

  private async generateTokenPair(payload: JwtPayload): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshTokenHash(username: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshTokenHash(username, refreshTokenHash);
  }
}
