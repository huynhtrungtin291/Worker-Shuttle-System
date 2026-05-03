import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Driver } from './schema/driver.schema';
import { CreateDriverWithUserDto } from './dto/create-driver-account.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
    private readonly usersService: UsersService,
  ) {}

  async createDriverWithUser(createDriverWithUserDto: CreateDriverWithUserDto): Promise<any> {
    // 1. Tạo tài khoản người dùng
    const userResult = await this.usersService.createUser(createDriverWithUserDto.createUserDto);
    const userId = userResult.data.id; // Lấy user_id vừa tạo
    const driverResult = await this.createDriver(createDriverWithUserDto, userId.toString()); // Tạo driver với user_id vừa lấy được
    // Kiểm tra xem tài khoản đã tồn tại chưa
    return driverResult;
  }

  async createDriver(createDriverWithUserDto: CreateDriverWithUserDto, userId: string): Promise<Driver> {
    // 2. Tạo driver với user_id
    const isLicenseNumberExist = await this.isLicenseNumberExist(
      createDriverWithUserDto.createDriverDto.license_number,
    );
    if (isLicenseNumberExist) {
      throw new ConflictException('Số bằng lái đã tồn tại');
    }
    try {
      const driver = new this.driverModel({
        ...createDriverWithUserDto.createDriverDto,
        user_id: userId,
      });
      return await driver.save();
    } catch (error: unknown) {
      console.error('Lỗi khi tạo Driver:', error);
      throw new InternalServerErrorException('Error creating driver');
    }
  }

  async isLicenseNumberExist(license_number: string): Promise<boolean> {
    const driver = await this.driverModel.exists({ license_number }).exec();
    return Boolean(driver);
  }
}
