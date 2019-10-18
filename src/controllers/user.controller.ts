import { Request, Response } from 'express';

import UserService from '../services/db/user.service';
import { UserInterface } from '../models/user.model';

export default class UsersController {
  static async findAll(_: Request, res: Response) {
    res.send(await UserService.findAll());
  }

  static async find(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);
    const user = await UserService.findOne(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ errors: ['User not found'] });
    }
  }

  static async create(req: Request, res: Response) {
    const user: UserInterface = req.body;
    res.send(await UserService.create(user));
  }

  static async update(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);
    const user: UserInterface = req.body;
    await UserService.update(userId, user);
    res.json();
  }

  static async delete(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);
    await UserService.delete(userId);
    res.json();
  }
}
