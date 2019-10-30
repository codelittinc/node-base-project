import BaseModel from '@models/base.model';
import * as faker from 'faker';

export abstract class BaseFactory<T extends BaseModel> {
  model: T;

  constructor(model: any) {
    this.model = model;
  }

  public getFaker() {
    return faker;
  }

  abstract build(params: Partial<T>): any;

  public async create(params: Partial<T> = {}): Promise<T> {
    const aModel = this.build(params);
    return await (this.model as any).create(aModel);
  }
}
