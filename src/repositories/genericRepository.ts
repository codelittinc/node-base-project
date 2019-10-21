import { UpdateOptions, DestroyOptions } from 'sequelize';
// @TODO: solve ts lint issues
// @ts-ignore
interface ModelInterface<T> {
  // @ts-ignore
  findAll<T>(arg0: object);
  findByPk<T>(id: number): Promise<ModelInterface<T> | null>;
  create<T>(arg0: object): Promise<ModelInterface<T> | null>;
  update<T>(arg0: ModelInterface<T>, arg1: object): object;
  // @ts-ignore
  destroy<T>(arg0: object): void;
}

export default class GenericRepository<T> {
  public Model: ModelInterface<T>;

  constructor(t: ModelInterface<T>) {
    this.Model = t;
  }

  async findAll(): Promise<ModelInterface<T>[] | null> {
    return this.Model.findAll<ModelInterface<T>>({});
  }

  async findOne(id: number): Promise<ModelInterface<T> | null> {
    return this.Model.findByPk<ModelInterface<T>>(id);
  }

  async create(user: object): Promise<ModelInterface<T> | null> {
    return this.Model.create<T>(user);
  }

  async update( id: number, user: ModelInterface<T>): Promise<object> {
    const updateOpts: UpdateOptions = {
      where: { id },
      limit: 1
    };

    return this.Model.update(user, updateOpts);
  }

  async delete(id: number) {
    const deleteOpts: DestroyOptions = {
      where: { id },
      limit: 1
    };

    return this.Model.destroy(deleteOpts);
  }
}
