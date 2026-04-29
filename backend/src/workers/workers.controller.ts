import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerWithUserDto } from './dto/create-woreker-with-user.dto';
import { UserActor } from '../common/enums/actor.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @UseGuards(RolesGuard)
  @Roles(UserActor.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateWorkerWithUserDto) {
    return this.workersService.createWorkerAndUser(createUserDto);
  }
}
