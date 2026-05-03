import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateDriverDto {
  @IsString()
  license_number: string;

  @IsOptional()
  @IsDateString()
  license_expires_at?: string;
}
