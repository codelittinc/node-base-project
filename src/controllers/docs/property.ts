import { IProperty } from '@controllers/types/property';
import { userExample } from '@controllers/docs/user';

export const propertyExample: IProperty = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: '5th Avenue',
  user: userExample,
  minRent: 100.5,
  maxRent: 10000
};
