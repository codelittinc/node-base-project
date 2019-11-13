import { getApp } from '@server';
import { UserFactory } from '../factories/user.factory';
import * as request from 'supertest';

const userFactory = new UserFactory();
const nonExistingId = 100;

describe('UsersController', () => {
  describe('GET /users', () => {
    it('returns a list of users', async () => {
      const user = await userFactory.create();

      const { body } = await request(getApp())
        .get(`/users`)
        .send();

      expect(body[0].name).toBe(user.name);
    });
  });

  describe('GET /users/:id', () => {
    it('with an existing id it returns the user', async () => {
      const user = await userFactory.create();

      const { body } = await request(getApp())
        .get(`/users/${user!.id}`)
        .send();

      expect(body.name).toBe(user.name);
    });

    it('with a non-existing id it returns 404', async () => {
      const { body } = await request(getApp())
        .get(`/users/${nonExistingId}`)
        .send();
      expect(body.code).toBe(404);
    });
  });

  describe('POST /users', () => {
    it('with valid params it creates a user', async () => {
      const { body } = await request(getApp())
        .post('/users')
        .send(userFactory.build());
      expect(body.id).toBeTruthy();
    });

    it('with empty params it returns 400', async () => {
      const { body } = await request(getApp())
        .post('/users')
        .send();
      expect(body.code).toBe(400);
    });

    it('with invalid params it returns 400', async () => {
      const { body } = await request(getApp())
        .post('/users')
        .send(
          userFactory.build({
            name: userFactory.getFaker().random.alphaNumeric(129)
          })
        );
      expect(body.code).toBe(400);
    });
  });

  describe('UPDATE /users/:id', () => {
    it('with valid params it updates the user', async () => {
      const user = await userFactory.create();

      const { body } = await request(getApp())
        .patch(`/users/${user!.id}`)
        .send(userFactory.build());

      expect(user.name).not.toEqual(body.name);
    });

    it('with a non-existing id it returns 404', async () => {
      const { body } = await request(getApp())
        .patch(`/users/${nonExistingId}`)
        .send();
      expect(body.code).toBe(404);
    });

    it('with invalid params it returns 400', async () => {
      const user = await userFactory.create();
      const { body } = await request(getApp())
        .patch(`/users/${user!.id}`)
        .send(
          userFactory.build({
            name: userFactory.getFaker().random.alphaNumeric(129)
          })
        );
      expect(body.code).toBe(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('when the user exists it returns 1 on the response', async () => {
      const user = await userFactory.create();

      const { body } = await request(getApp())
        .delete(`/users/${user!.id}`)
        .send();

      expect(body.count).toBe(1);
    });

    it('when the user doesn`t exist it returns 404', async () => {
      const { body } = await request(getApp())
        .delete(`/users/${nonExistingId}`)
        .send();
      expect(body.code).toBe(404);
    });
  });
});
