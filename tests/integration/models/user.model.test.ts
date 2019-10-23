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
  describe('Add new user', () => {
    it('creates a user with valid data', async () => {
      const userParams = {
        name: 'test name'
      };

      const user = await User.create(userParams);
      expect(user!.id).toBeTruthy();
    });

    it('fails to create a user with invalid data', async () => {
      const userParams = {
        name: generateString(129)
      };

      expect(User.create(userParams)).rejects.toThrowError();
    });
  });
});
