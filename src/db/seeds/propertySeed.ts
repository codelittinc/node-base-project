import * as faker from 'faker';
import { Property, User } from '@models';

const PROPERTY_COUNT = 100;

export default async () => {
  console.log('Running properties seed');
  const user = User.findByName('Avison Young');
  for (let i = 0; i <= PROPERTY_COUNT; i++) {
    await Property.create({
      name: faker.address.streetName(),
      minRent: faker.random.number(1000),
      maxRent: faker.random.number({ min: 1001, max: 10000 }),
      user,
    });
  }

  console.log('Completed running properties seed');
};
