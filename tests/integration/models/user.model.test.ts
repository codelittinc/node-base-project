import { User } from '@models/user.model';
import { UserFactory } from '../factories/user.factory';

const userFactory = new UserFactory();

describe('User', () => {
  describe('#create', () => {
    describe('with valid params', () => {
      it('creates a user', async () => {
        const user = await userFactory.create();
        expect(user!.id).toBeTruthy();
      });
    });

    describe('with invalid params', () => {
      it('fails to create a user', async () => {
        const userParams = userFactory.build({
          name: userFactory.getFaker().random.alphaNumeric(129)
        });

        await expect(User.create(userParams)).rejects.toThrowError();
      });
    });
  });

  describe('#findByName', () => {
    describe('with valid params', () => {
      it('returns the user', async () => {
        const user = await userFactory.create();
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
        const user = await userFactory.create();
        const updatedUser = await User.updateOne({
          id: user.id,
          name: userFactory.getFaker().random.alphaNumeric()
        });
        expect(updatedUser!.name).not.toEqual(user.name);
      });
    });

    describe('with a invalid name', () => {
      it('throws an database error', async () => {
        const user = await userFactory.create();

        const invalidUser = userFactory.build({
          name: userFactory.getFaker().random.alphaNumeric(129),
          id: user.id
        });

        await expect(User.updateOne(invalidUser)).rejects.toThrowError();
      });
    });
  });
});
