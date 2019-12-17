import { User } from '@models';

export default function(factory: any) {
  factory.define('user', User, {
    id: factory.sequence('User.id', (n: number) => n),
    name: factory.chance('name'),
  });
}
