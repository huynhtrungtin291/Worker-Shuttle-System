import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateDriverVehicleAssignmentDto {
  @IsString()
  driver_id: string;

  @IsString()
  vehicle_id: string;

  @IsDateString()
  start_at: string;

  @IsOptional()
  @IsDateString()
  end_at?: string;

  @IsOptional()
  @IsString()
  shift_id?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}