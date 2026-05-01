import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { UserActor } from '../common/enums/actor.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}
  @UseGuards(RolesGuard)
  @Roles(UserActor.ADMIN)
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.createVehicle(createVehicleDto);
  }
}
