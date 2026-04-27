import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from './guards/role.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret',
      signOptions: { expiresIn: '40s' },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtRefreshGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
