import { DataTypes, FindOptions } from 'sequelize';
import { database } from '@db';
import BaseModel from './base.model';
import { Property } from './property.model';

export class User extends BaseModel {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly properties: Property[];

  public static async findByName(name: string): Promise<User | null> {
    const queryOpts = {
      where: { name }
    };

    return User.findOne(queryOpts);
  }

  static getFindOptions(): FindOptions {
    return {
      include: [
        {
          model: Property,
          as: 'properties'
        }
      ]
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    tableName: 'users',
    sequelize: database
  }
);

User.hasMany(Property, { as: 'properties', foreignKey: 'userId' });
Property.belongsTo(User, { as: 'user' });
