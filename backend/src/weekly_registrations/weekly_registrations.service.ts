import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeeklyRegistration } from './schema/weekly-registration.schema';
import { CreateWeeklyRegistrationDto } from './dto/create-weekly-registration.dto';
@Injectable()
export class WeeklyRegistrationsService {
  constructor(@InjectModel(WeeklyRegistration.name) private weeklyRegistrationModel: Model<WeeklyRegistration>) {}
  async createWeeklyRegistration(weeklyRegistrationDto: CreateWeeklyRegistrationDto) {
    if (await this.isWeeklyRegistrationExist(weeklyRegistrationDto.worker_id, weeklyRegistrationDto.trip_date)) {
      throw new Error('Đăng ký hàng tuần đã tồn tại cho worker_id và trip_date này');
    }
    try {
      const weeklyRegistration = new this.weeklyRegistrationModel(weeklyRegistrationDto);
      return await weeklyRegistration.save();
    } catch (error: unknown) {
      console.error('Error creating Weekly Registration:', error);
      throw new Error('Có lỗi khi tạo đăng ký hàng tuần');
    }
  }

  async isWeeklyRegistrationExist(worker_id: string, trip_date: string): Promise<boolean> {
    const registration = await this.weeklyRegistrationModel.exists({ worker_id, trip_date }).exec();
    return Boolean(registration);
  }
}
