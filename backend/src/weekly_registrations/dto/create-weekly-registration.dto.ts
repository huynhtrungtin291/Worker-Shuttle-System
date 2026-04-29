import { IsString, IsEnum, IsOptional, Matches, IsInt } from 'class-validator';

export class CreateWeeklyRegistrationDto {
  @IsString()
  worker_id: string;

  @IsString()
  shift_id: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'trip_date must be YYYY-MM-DD' })
  trip_date: string;

  @IsEnum(['to_factory', 'from_factory', 'both'])
  direction: 'to_factory' | 'from_factory' | 'both';

  @IsOptional()
  @IsEnum(['registered', 'cancelled', 'missed'])
  status?: 'registered' | 'cancelled' | 'missed';

  @IsOptional()
  @IsString()
  cancel_reason?: string;

  @IsOptional()
  @IsInt()
  iso_week?: number;

  @IsOptional()
  @IsInt()
  iso_year?: number;
}
