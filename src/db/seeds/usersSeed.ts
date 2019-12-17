import { User } from '@models';

export default async () => {
  console.log('Running user seed');
  await User.create({
    name: 'Codelitt',
  });
  await User.create({
    name: 'Avison Young',
  });
  console.log('Completed running user seed');
};
