import { UpdateOptions, DestroyOptions } from 'sequelize';
 // @TODO: solve ts lint issues
// @ts-ignore
interface ModelInterface<T> {
  // @ts-ignore
  findAll<T>(object);
  // @ts-ignore
  findByPk<T>(id: number);
  // @ts-ignore
  create<T>(object);
  // @ts-ignore
  update<T>(ModelInterface, object);
  // @ts-ignore
  destroy<T>(object);
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

  async update(id: number, user: ModelInterface<T>) {
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
