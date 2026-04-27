import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../../common/interface/jwtpayload.interface';

type RefreshRequest = Request<Record<string, string>, unknown, { refreshToken?: string }> & {
  user?: JwtPayload;
  refreshToken?: string;
};

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  private readonly refreshSecret = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RefreshRequest = context.switchToHttp().getRequest();
    const token = this.extractRefreshToken(request);

    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.refreshSecret,
      });

      request.user = payload;
      request.refreshToken = token;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private extractRefreshToken(request: RefreshRequest): string | undefined {
    const fromBody = request.body?.refreshToken;
    if (typeof fromBody === 'string' && fromBody.length > 0) {
      return fromBody;
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
