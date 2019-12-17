import { getApp } from '@server';
import { User } from '@models';
import * as request from 'supertest';

describe('UsersController', () => {
  describe('GET /users', () => {
    it('returns a list of users', async () => {
      const expetedUsers = [
        {
          name: 'Gabriel',
        },
      ];
      const mockGetAll = jest.fn();
      mockGetAll.mockReturnValue(expetedUsers);
      User.getAll = mockGetAll.bind(User);

      const { body } = await request(getApp())
        .get(`/users`)
        .send();

      expect(mockGetAll).toHaveBeenCalled();
      expect(expetedUsers).toStrictEqual(body);
    });
  });

  describe('GET /users/:id', () => {
    describe('with an existing id', async () => {
      it('returns the user', async () => {
        const expetedUser = {
          name: 'Gabriel',
        };

        const mockGet = jest.fn();
        mockGet.mockReturnValue(expetedUser);
        User.get = mockGet.bind(User);

        const { body } = await request(getApp())
          .get('/users/1')
          .send();

        expect(mockGet).toHaveBeenCalled();
        expect(expetedUser).toStrictEqual(body);
      });
    });

    describe('with a non-existing id', async () => {
      it('returns 404', async () => {
        const mockGet = jest.fn();
        mockGet.mockReturnValue(null);
        User.get = mockGet.bind(User);
        const nonExistingId = 100;

        const { body } = await request(getApp())
          .get(`/users/${nonExistingId}`)
          .send();

        expect(body.code).toBe(404);
      });
    });
  });
});
