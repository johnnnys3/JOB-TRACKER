import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}
