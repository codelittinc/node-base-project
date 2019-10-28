import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  SuccessResponse,
  Tags,
  Response
} from 'tsoa';
import { User, IUser } from '../models/user.model';
import { NotFoundError } from '@server/errors';

@Route('users')
@Tags('Users')
export class UsersController extends Controller {
  /**
   * List all created users
   */
  @Get()
  async list(): Promise<IUser[]> {
    return await User.findAll();
  }

  /**
   * Search's for the user by primary identifier
   * @param id Primary identifier of the user
   */
  @Get('{id}')
  @Response('404', 'Model not found')
  async show(id: number): Promise<IUser> {
    const user = await User.findByPk(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundError('User not found');
    }
  }

  /**
   * Creates a user
   * @param user This is the user body creation request
   */
  @SuccessResponse('201', 'Created')
  @Post()
  async create(@Body() user: any): Promise<IUser> {
    return await User.create(user);
  }

  /**
   * Updates a user
   * @param user The user to be updated
   */
  @Put()
  async update(@Body() user: any) {
    await User.updateOne(user);
  }

  /**
   * Delete a user by ID
   * @param id Identifier for the user
   * */
  @Delete('{id}')
  async delete(id: number) {
    await User.deleteOne(id);
  }
}
