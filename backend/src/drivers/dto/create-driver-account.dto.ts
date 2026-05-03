import { IsDefined, ValidateNested } from 'class-validator';
import { CreateDriverDto } from './create-driver.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Type } from 'class-transformer';
export class CreateDriverWithUserDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateDriverDto) // Cực kỳ quan trọng để NestJS biết kiểu dữ liệu để validate
  createDriverDto: CreateDriverDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => CreateUserDto)
  createUserDto: CreateUserDto;
}
