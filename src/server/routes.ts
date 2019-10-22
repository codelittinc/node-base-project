import UsersController from '@controllers/user.controller';

export function setupRoutes(app) {
  // /users
  app.get('/users', UsersController.list);
  app.get('/users/:id', UsersController.show);
  app.post('/users', UsersController.create);
  app.put('/users/:id', UsersController.update);
  app.delete('/users/:id', UsersController.delete);
}
