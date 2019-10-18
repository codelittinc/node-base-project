import UsersController from '../controllers/user.controller'

export function setupRoutes(app) {
  // /users
  app.get('/users', UsersController.getUsers);
  app.post('/users', UsersController.createUser);
}
