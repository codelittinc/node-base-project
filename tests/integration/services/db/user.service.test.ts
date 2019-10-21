import UsersService from '@services/db/user.service';
import { UserInterface } from '@models/user.model';

describe('#create', () => {
  it('returns a User with an id', () => {
    const userParams: UserInterface = {
      name: 'test name'
    };

    return UsersService.create(userParams).then(user => {
      expect(user!.id).toBeTruthy();
    });
  });
});
