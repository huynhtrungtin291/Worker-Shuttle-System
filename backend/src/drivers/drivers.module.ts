import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver, DriverSchema } from './schema/driver.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]), UsersModule],
  controllers: [DriversController],
  providers: [DriversService],
})
export class DriversModule {}
