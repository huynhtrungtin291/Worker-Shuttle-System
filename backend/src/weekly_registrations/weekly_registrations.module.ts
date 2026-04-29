import { Module } from '@nestjs/common';
import { WeeklyRegistrationsService } from './weekly_registrations.service';
import { WeeklyRegistrationsController } from './weekly_registrations.controller';

@Module({
  controllers: [WeeklyRegistrationsController],
  providers: [WeeklyRegistrationsService],
})
export class WeeklyRegistrationsModule {}
