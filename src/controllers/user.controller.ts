import { Request, Response } from 'express';
import { User } from '@models/user.model';

export default class UsersController {
  static async list(_: Request, res: Response) {
    res.send(await User.findAll());
  }

  static async show(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);
    const user = await User.findByPk(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ errors: ['User not found'] });
    }
  }

  static async create(req: Request, res: Response) {
    const user: object = req.body;
    res.send(await User.create(user));
  }

  static async update(req: Request, res: Response) {
    const user = req.body;
    await User.updateOne(user);
    res.json();
  }

  static async delete(req: Request, res: Response) {
    const userId: number = parseInt(req.params.id);
    await User.deleteOne(userId);
    res.json();
  }
}
