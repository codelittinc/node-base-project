import { getApp } from '../../src/server';
import UserService from '../../src/services/db/user.service';
import * as request from 'supertest';

describe('UsersController', () => {
  /* @TODO: add transactional feature to tests before adding this test
  describe('GET /users', () => {
    it('returns list of users', async () => {
      const userData = {
        name: 'user test'
      };
      UserService.create(userData);

      const { body } = await request(getApp())
        .get(`/users`)
        .send();

      return expect(body[0].name).toBe(userData.name);
    });
  });
  */

  describe('GET /users/:id', () => {
    it('returns the user', async () => {
      const userData = {
        name: 'user test'
      };
      const user = await UserService.create(userData);

      const { body } = await request(getApp())
        .get(`/users/${user!.id}`)
        .send();

      return expect(body.name).toBe(userData.name);
    });
  });
});
