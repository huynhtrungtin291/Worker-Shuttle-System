import { WeeklyRegistrationSchema } from './schema/weekly-registration.schema';
import { Module } from '@nestjs/common';
import { WeeklyRegistrationsService } from './weekly_registrations.service';
import { WeeklyRegistrationsController } from './weekly_registrations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WeeklyRegistration } from './schema/weekly-registration.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: WeeklyRegistration.name, schema: WeeklyRegistrationSchema }])],
  controllers: [WeeklyRegistrationsController],
  providers: [WeeklyRegistrationsService],
})
export class WeeklyRegistrationsModule {}
