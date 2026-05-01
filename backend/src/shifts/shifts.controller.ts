import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UserActor } from '../common/enums/actor.enum';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}
  @UseGuards(RolesGuard)
  @Roles(UserActor.ADMIN)
  @Post()
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.createShift(createShiftDto);
  }
}
