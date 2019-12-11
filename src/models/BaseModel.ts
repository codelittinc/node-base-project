import { Model, UpdateOptions, DestroyOptions, FindOptions } from 'sequelize';

abstract class BaseModel extends Model {
  public static async updateOne(instance: any): Promise<any | null> {
    const updateOpts: UpdateOptions = {
      where: { id: instance.id },
      limit: 1,
      returning: true
    };

    const result = await (this as any).update(instance, updateOpts);
    if (result[0]) {
      return result[1][0];
    }
    return null;
  }

  public static async deleteOne(id: number): Promise<number> {
    const deleteOpts: DestroyOptions = {
      where: { id },
      limit: 1
    };

    return (this as any).destroy(deleteOpts);
  }

  public static async get(
    id: number,
    options?: FindOptions | undefined
  ): Promise<any | null> {
    return await (this as any).findByPk(id, options || this.getFindOptions());
  }

  public static async getAll(
    options?: FindOptions | undefined
  ): Promise<any[]> {
    return await (this as any).findAll(options || this.getFindOptions());
  }

  public static getFindOptions(): FindOptions {
    return {};
  }
}

export default BaseModel;
