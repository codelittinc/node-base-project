import { DataTypes, FindOptions, Association } from 'sequelize';
import { database } from '@db';
import { User } from './UserModel';
import BaseModel from './BaseModel';

export class Property extends BaseModel {
  public id!: number;
  public name!: string;
  public minRent!: number;
  public maxRent!: number;
  public user!: User;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    user: Association<Property, User>;
  };

  public static getFindOptions(): FindOptions {
    return {
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    };
  }
}

Property.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    minRent: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    maxRent: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'properties',
    sequelize: database,
  },
);
