import { Controller, Post, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverWithUserDto } from './dto/create-driver-account.dto';
import { Roles } from '../auth/decorators/role.decorator';
import { UserActor } from '../common/enums/actor.enum';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}
  @UseGuards(RolesGuard)
  @Roles(UserActor.ADMIN)
  @Post('create-with-user')
  async createDriverWithUser(createDriverWithUserDto: CreateDriverWithUserDto): Promise<any> {
    return this.driversService.createDriverWithUser(createDriverWithUserDto);
  }
}
