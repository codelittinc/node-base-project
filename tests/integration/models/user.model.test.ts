import { User } from '@models/user.model';

import { generateString } from '@utils/string';

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
