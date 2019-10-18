import { User } from "../models/user.model";

export default class UsersController {
    static async getUsers(_, res) {
        res.send(await User.findAll<User>({}))
    }

    static createUser(req, res) {
        // @TODO: refactor to use database
        res.send(
            {
                ...req.body,
                id: 1,
            }
        )
    }
}