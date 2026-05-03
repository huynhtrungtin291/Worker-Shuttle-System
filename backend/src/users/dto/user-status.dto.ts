import { IsBoolean, IsString } from 'class-validator';

export class UserStatusDto {
  @IsString()
  username: string;

  @IsBoolean()
  is_active: boolean;
}
