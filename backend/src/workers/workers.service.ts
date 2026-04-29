import { InjectModel } from '@nestjs/mongoose';
import { Worker } from './schema/worker.schema';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateWorkerWithUserDto as WorkerAndUser } from './dto/create-woreker-with-user.dto';
@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<Worker>,
    private usersService: UsersService,
  ) {}
  async createWorkerAndUser(createWorkerAndUser: WorkerAndUser): Promise<any> {
    // 1. Tạo Account
    const userResult = await this.usersService.createUser(createWorkerAndUser.createUserDto);
    const userId = userResult.data.id; // Lấy user_id vừa tạo

    // 2. Tạo Worker với user_id
    return await this.createWorker(createWorkerAndUser.createWorkerDto, userId.toString());
  }

  async createWorker(createWorkerDto: CreateWorkerDto, userId: string) {
    // Không cần query user nữa, vì đã có user_id
    const isEmployeeCodeExist = await this.checkEmployeeCode(createWorkerDto.employee_code);
    if (isEmployeeCodeExist) {
      throw new ConflictException('Mã nhân viên đã tồn tại');
    }

    try {
      const worker = new this.workerModel({
        ...createWorkerDto,
        user_id: userId,
      });
      return await worker.save();
    } catch (error) {
      console.error('Lỗi khi tạo Worker:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new InternalServerErrorException(`Có lỗi xảy ra khi lưu dữ liệu worker: ${errorMessage}`);
    }
  }

  async checkEmployeeCode(employee_code: string): Promise<boolean> {
    const worker = await this.workerModel.exists({ employee_code }).exec();
    return Boolean(worker);
  }
}
