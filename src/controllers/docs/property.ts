import { IPropertyRead, IPropertyWrite } from '@controllers/types/property';
import { baseUserExample } from './user';

const basePropertyExample = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '5th Avenue',
  minRent: 100.5,
  maxRent: 10000
};

export const propertyReadExample: IPropertyRead = {
  ...basePropertyExample,
  user: baseUserExample
};

export const propertyWriteExample: IPropertyWrite = {
  ...basePropertyExample,
  userId: baseUserExample.id!
};
