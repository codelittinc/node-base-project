import { User } from '@models/user.model';

function generateString(length: number) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

describe('User', () => {
  describe('#create', () => {
    describe('with valid params', () => {
      it('creates a user', async () => {
        const userParams = {
          name: 'test name'
        };

        const user = await User.create(userParams);
        expect(user!.id).toBeTruthy();
      });
    });

    describe('with invalid params', () => {
      it('fails to create a user', async () => {
        const userParams = {
          name: generateString(129)
        };

        expect(User.create(userParams)).rejects.toThrowError();
      });
    });
  });
});
