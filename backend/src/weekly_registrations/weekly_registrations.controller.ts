import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WeeklyRegistrationsService } from './weekly_registrations.service';
import { UserActor } from '../common/enums/actor.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateWeeklyRegistrationDto } from './dto/create-weekly-registration.dto';

@Controller('weekly-registrations')
export class WeeklyRegistrationsController {
  constructor(private readonly weeklyRegistrationsService: WeeklyRegistrationsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserActor.WORKER)
  @Post()
  createWeeklyRegistration(@Body() createWeeklyRegistrationDto: CreateWeeklyRegistrationDto) {
    return this.weeklyRegistrationsService.createWeeklyRegistration(createWeeklyRegistrationDto);
  }
}
