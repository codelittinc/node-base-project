import Factory from '../factory';
import { Property } from '@models';

describe('Property', () => {
  describe('#create', () => {
    describe('with valid params', () => {
      it('creates a property', async () => {
        const property = await Factory.create('property');
        expect(property!.id).toBeTruthy();
      });

      it('creates a property for a specific user', async () => {
        const user = await Factory.create('user');
        const property = await Factory.create('property', {
          userId: user.id,
        });
        expect(property!.userId).toBe(user.id);
      });
    });
  });

  describe('#get', () => {
    describe('with valid property id', () => {
      it('returns the property with the user', async () => {
        const property = await Factory.create('property');
        const propertyWithAssociations = await Property.get(property!.id);
        expect(propertyWithAssociations!.user).toBeTruthy();
      });
    });
  });
});
