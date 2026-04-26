import { UserActor } from '../enums/actor.enum';
export interface JwtPayload {
  username: string;
  fullname: string;
  phone: string;
  role: UserActor;
  fcm_token: string | null;
}
