import { Property } from '@models';

export default function(factory: any) {
  factory.define('property', Property, {
    id: factory.sequence('Property.id', (n: number) => n),
    name: factory.chance('name'),
    minRent: factory.chance('integer', { min: 0, max: 1000 }),
    maxRent: factory.chance('integer', { min: 1001, max: 2000 }),
    userId: factory.assoc('user', 'id')
  });
}
