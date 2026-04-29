import { Injectable, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift, ShiftDocument } from './schema/shift.schema';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(@InjectModel(Shift.name) private shiftModel: Model<ShiftDocument>) {}

  async createShift(createShiftDto: CreateShiftDto) {
    // Optional: prevent duplicate shift name
    const exists = await this.shiftModel.exists({ name: createShiftDto.name });
    if (exists) {
      throw new ConflictException('Shift name already exists');
    }

    try {
      const shift = new this.shiftModel(createShiftDto);
      return await shift.save();
    } catch (error: unknown) {
      console.error('Error creating Shift:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Có lỗi khi tạo shift: ${message}`);
    }
  }
}
