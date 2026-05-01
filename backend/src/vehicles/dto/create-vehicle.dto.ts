import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  plate_number: string;

  @IsString()
  vehicle_type: string;

  @IsNumber()
  @Min(0)
  capacity: number;

  @IsOptional()
  @IsString()
  contractor_name?: string | null;

  @IsOptional()
  @IsString()
  contractor_phone?: string | null;

  @IsOptional()
  @IsEnum(['available', 'in_use', 'maintenance', 'retired'])
  status?: 'available' | 'in_use' | 'maintenance' | 'retired';

  @IsOptional()
  @IsString()
  notes?: string | null;
}
