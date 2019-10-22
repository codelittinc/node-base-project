import UsersService from '@services/db/user.service';
import { UserInterface } from '@models/user.model';

describe('#create', () => {
  it('returns a User with an id', async () => {
    const userParams: UserInterface = {
      name: 'test name'
    };

    const user = await UsersService.create(userParams);
    expect(user!.id).toBeTruthy();
  });
});
