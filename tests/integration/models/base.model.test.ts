import { User as BaseModel } from '@models/user.model';
import { UserFactory } from '../factories/user.factory';

/*
 * As a base model example we are using the User model.
 * For base model methods add tests in this file to avoid duplication.
 */

const BaseFactory = new UserFactory();
const nonExistingId = 100;

describe('BaseModel', () => {
  describe('#create', () => {
    describe('with valid params', () => {
      it('creates a model', async () => {
        const baseModel = await BaseFactory.create();
        expect(baseModel!.id).toBeTruthy();
      });
    });
  });

  describe('#deleteOne', () => {
    describe('with an existing id', () => {
      it('deletes the model', async () => {
        const baseModel = await BaseFactory.create();
        const count = await BaseModel.deleteOne(baseModel.id);
        expect(count).toEqual(1);
      });
    });

    describe('with an non-existing id', () => {
      it(`doesn't delete a model`, async () => {
        const count = await BaseModel.deleteOne(nonExistingId);
        await expect(count).toEqual(0);
      });
    });
  });

  describe('#get', () => {
    describe('with an existing id', () => {
      it('returns the model', async () => {
        const model = await BaseFactory.create();
        const recoveredModel = await BaseModel.get(model.id);
        expect(model.name).toEqual(recoveredModel!.name);
      });
    });

    describe('with an non-existing id', () => {
      it('returns null', async () => {
        const model = await BaseModel.get(nonExistingId);
        await expect(model).toBeFalsy();
      });
    });
  });
});
