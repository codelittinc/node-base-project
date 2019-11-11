import { IUser } from '@controllers/types/user';

export const baseUserExample: IUser = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Joe'
};
export const userExample: IUser = {
  ...baseUserExample,
  properties: [
    {
      id: 1,
      name: '5th Avenue',
      minRent: 1,
      maxRent: 1000,
      userId: baseUserExample.id!
    }
  ]
};
