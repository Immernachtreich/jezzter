import { User } from '../models/index';

declare namespace Express {
  export interface Request {
    user?: User;
  }
}
