import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../common/interface/jwtpayload.interface';
import { AccessRequest } from '../../common/types/request-context.type';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET || 'your_jwt_access_secret_key';
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('JWT Access Secret:', this.accessSecret); // Debug log to check the secret value
    const request: AccessRequest = context.switchToHttp().getRequest();
    const token = this.extractAccessToken(request);

    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.accessSecret,
      });

      request.user = payload;
      request.accessToken = token;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractAccessToken(request: AccessRequest): string | undefined {
    const fromBody = request.body?.accessToken;
    if (typeof fromBody === 'string' && fromBody.length > 0) {
      return fromBody;
    }

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
