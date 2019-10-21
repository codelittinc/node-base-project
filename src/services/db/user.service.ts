import { User } from '@models/user.model';
// @TODO: repositories aliases
import GenericRepository from '../../repositories/genericRepository';

export default class UsersService extends GenericRepository<User> {
  constructor() {
    super(User);
  }
}
