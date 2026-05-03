import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from './guards/role.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret',
      signOptions: { expiresIn: '2h' },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtRefreshGuard,
    JwtAccessGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
