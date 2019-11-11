import { User } from '@models/user.model';
import Factory from '../factory';

describe('User', () => {
  describe('#create', () => {
    describe('with valid params', () => {
      it('creates a user', async () => {
        const user = await Factory.create('user');
        expect(user!.id).toBeTruthy();
      });
    });

    describe('with invalid params', () => {
      it('fails to create a user', async () => {
        const userParams = Factory.build('user', {
          name: Factory.chance('string', { length: 129 })
        });

        await expect(User.create(userParams)).rejects.toThrowError();
      });
    });
  });

  describe('#findByName', () => {
    describe('with valid params', () => {
      it('returns the user', async () => {
        const user = await Factory.create('user');
        const searchedUser = await User.findByName(user.name);
        expect(searchedUser!.id).toBeTruthy();
      });
    });

    describe('with invalid params', () => {
      it('returns null', async () => {
        const searchedUser = await User.findByName(`a user that doesn't exist`);
        expect(searchedUser).toBeFalsy();
      });
    });
  });

  describe('#updateOne', () => {
    describe('with a valid name', () => {
      it('updates the user', async () => {
        const user = await Factory.create('user');
        const updatedUser = await User.updateOne({
          id: user.id,
          name: Factory.chance('string', { length: 100 })()
        });
        expect(updatedUser!.name).not.toEqual(user.name);
      });
    });

    describe('with a invalid name', () => {
      it('throws an database error', async () => {
        const user = await Factory.create('user');

        const invalidUser = await Factory.build('user', {
          name: Factory.chance('string', { length: 129 }),
          id: user.id
        });
        await expect(User.updateOne(invalidUser.get())).rejects.toThrowError();
      });
    });
  });
});
