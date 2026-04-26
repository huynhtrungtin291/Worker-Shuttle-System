import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';
import { RolesGuard } from './guards/role.guard';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'your_jwt_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
