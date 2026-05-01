import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './schema/vehicle.schema';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
@Injectable()
export class VehiclesService {
  constructor(@InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>) {}
  async createVehicle(createVehicleDto: CreateVehicleDto) {
    if (await this.isPlateNumberExists(createVehicleDto.plate_number)) {
      throw new Error('Số biển xe đã tồn tại');
    }
    try {
      const vehicle = new this.vehicleModel(createVehicleDto);
      return vehicle.save();
    } catch (error: unknown) {
      throw new Error(
        'Lỗi khi tạo phương tiện với dữ liệu: ' +
          JSON.stringify(createVehicleDto) +
          '. Chi tiết lỗi: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  async isPlateNumberExists(plateNumber: string) {
    return this.vehicleModel.exists({ plate_number: plateNumber });
  }
}
