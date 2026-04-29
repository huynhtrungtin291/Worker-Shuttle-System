import { IsString, IsOptional, IsBoolean, Matches } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'start_time must be in HH:mm format' })
  start_time: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'factory_arrival_deadline must be in HH:mm format' })
  factory_arrival_deadline: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
