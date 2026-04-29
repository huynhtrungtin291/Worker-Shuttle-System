import type { Request } from 'express';
import type { JwtPayload } from '../interface/jwtpayload.interface';

export type UserRequest = Request & {
  user?: JwtPayload;
};

export type RefreshRequest = Request<Record<string, string>, unknown, { refreshToken?: string }> & {
  user?: JwtPayload;
  refreshToken?: string;
};

export type AccessRequest = Request<Record<string, string>, unknown, { accessToken?: string }> & {
  user?: JwtPayload;
  accessToken?: string;
};
