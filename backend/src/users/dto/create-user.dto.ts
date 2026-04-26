import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { UserActor } from '../../common/enums/actor.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullname: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{9,11}$/, { message: 'phone must be 9-11 digits' })
  phone: string;

  @IsEnum(UserActor)
  role: UserActor;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsDateString()
  last_login_at?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fcm_token?: string;
}
