import { UpdateOptions, DestroyOptions } from 'sequelize';
import { User, UserInterface } from '../../models/user.model';

export default class UsersService {
  static async findAll(): Promise<User[] | null> {
    return User.findAll<User>({});
  }
  static async findOne(id: number): Promise<User | null> {
    return User.findByPk<User>(id);
  }
  static async create(user: UserInterface): Promise<User | null> {
    return User.create<User>(user);
  }
  static async update(id: number, user: UserInterface) {
    const updateOpts: UpdateOptions = {
      where: { id },
      limit: 1
    };

    return User.update(user, updateOpts);
  }
  static async delete(id: number) {
    const deleteOpts: DestroyOptions = {
      where: { id },
      limit: 1
    };

    return User.destroy(deleteOpts);
  }
}
