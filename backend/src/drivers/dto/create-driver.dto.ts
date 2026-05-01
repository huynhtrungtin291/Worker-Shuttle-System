import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  user_id: string;

  @IsString()
  license_number: string;

  @IsOptional()
  @IsDateString()
  license_expires_at?: string;
}
