import { Request } from 'express';
import { IJwtPayload } from '../../auth/interfaces/auth.interfaces';

export type RequestType = {
  user: IJwtPayload;
} & Request;
