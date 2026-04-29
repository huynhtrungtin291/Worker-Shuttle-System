import { Module } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './schema/shift.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Shift.name, schema: ShiftSchema }])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
})
export class ShiftsModule {}
