import { IPropertyWrite } from './property';

export interface IUser {
  id?: number;
  name: string;
  properties?: IPropertyWrite[];
  createdAt?: Date;
  updatedAt?: Date;
}
