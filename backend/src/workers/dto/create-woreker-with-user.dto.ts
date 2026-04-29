import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateWorkerDto } from './create-worker.dto';

export class CreateWorkerWithUserDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateWorkerDto) // Cực kỳ quan trọng để NestJS biết kiểu dữ liệu để validate
  createWorkerDto: CreateWorkerDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateUserDto)
  createUserDto: CreateUserDto;
}
