import { IUser } from './user';

export interface IProperty {
  id?: number;
  name: string;
  minRent: number;
  maxRent: number;
  user: IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
