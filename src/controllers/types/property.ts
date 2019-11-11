import { IUser } from './user';

export interface IPropertyWrite {
  id?: number;
  name: string;
  minRent: number;
  maxRent: number;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPropertyRead {
  id?: number;
  name: string;
  minRent: number;
  maxRent: number;
  user: IUser;
  userId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
