import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserActor } from '../common/enums/actor.enum';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(UserActor.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserActor.ADMIN)
  @Post('set-account-status')
  setAccountStatus(@Body() body: { username: string; is_active: boolean }) {
    const { username, is_active } = body;
    return this.usersService.setAccountStatus(username, is_active);
  }
}
