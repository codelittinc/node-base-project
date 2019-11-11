import * as request from 'supertest';

import { getApp } from '@server';
import Factory from '../factory';

describe('UsersController', () => {
  const nonExistingId = 100;

  describe('GET /users', () => {
    it('returns a list of users', async () => {
      const user = await Factory.create('user');

      const { body } = await request(getApp())
        .get(`/users`)
        .send();

      expect(body[0].name).toBe(user.name);
    });
  });

  describe('GET /users/:id', () => {
    it('with an existing id it returns the user', async () => {
      const user = await Factory.create('user');

      const { body } = await request(getApp())
        .get(`/users/${user.id}`)
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
      const user = await Factory.build('user');
      const { body } = await request(getApp())
        .post('/users')
        .send(user.get());
      expect(body.id).toBeTruthy();
    });

    it('with empty params it returns 400', async () => {
      const { body } = await request(getApp())
        .post('/users')
        .send();
      expect(body.code).toBe(400);
    });

    it('with invalid params it returns 400', async () => {
      const invalidParams = await Factory.build('user', {
        name: Factory.chance('string', { length: 129 })
      });
      const { body } = await request(getApp())
        .post('/users')
        .send(invalidParams.get());
      expect(body.code).toBe(400);
    });
  });

  describe('UPDATE /users/:id', () => {
    it('with valid params it updates the user', async () => {
      const user = await Factory.create('user');
      const validParams = await Factory.build('user');

      const { body } = await request(getApp())
        .patch(`/users/${user.id}`)
        .send(validParams.get());

      expect(user.name).not.toEqual(body.name);
    });

    it('with a non-existing id it returns 404', async () => {
      const { body } = await request(getApp())
        .patch(`/users/${nonExistingId}`)
        .send();
      expect(body.code).toBe(404);
    });

    it('with invalid params it returns 400', async () => {
      const user = await Factory.create('user');
      const invalidParams = await Factory.build('user', {
        name: Factory.chance('string', { length: 129 })
      });
      const { body } = await request(getApp())
        .patch(`/users/${user!.id}`)
        .send(invalidParams.get());
      expect(body.code).toBe(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('when the user exists it returns 1 on the response', async () => {
      const user = await Factory.create('user');

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
