import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from '@nestjs/class-validator';
export class CreateWorkerDto {
  @IsNotEmpty()
  @IsString()
  employee_code: string;

  @IsOptional()
  @IsString()
  department?: string | null;

  @IsNotEmpty()
  @IsString()
  pickup_address: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickup_lat: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  pickup_lng: number;

  @IsOptional()
  @IsString()
  default_shift_id?: string | null;
}
