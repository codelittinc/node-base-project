export default class UsersController {
    static getUsers(_, res) {
        // @TODO: refactor to use database
        res.send([
            {
                id: 1,
                name: 'test user'
            }
        ])
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