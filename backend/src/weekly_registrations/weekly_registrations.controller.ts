import { Controller } from '@nestjs/common';
import { WeeklyRegistrationsService } from './weekly_registrations.service';

@Controller('weekly-registrations')
export class WeeklyRegistrationsController {
  constructor(private readonly weeklyRegistrationsService: WeeklyRegistrationsService) {}
}
