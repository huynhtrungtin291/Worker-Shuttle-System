import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { WorkersModule } from './workers/workers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ShiftsModule } from './shifts/shifts.module';
import { WeeklyRegistrationsModule } from './weekly_registrations/weekly_registrations.module';
import { DriversModule } from './drivers/drivers.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    WorkersModule,
    VehiclesModule,
    ShiftsModule,
    WeeklyRegistrationsModule,
    DriversModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
