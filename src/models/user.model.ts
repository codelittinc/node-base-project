import { Model, DataTypes } from "sequelize";
import { database } from "../config/initializers/database";

export class User extends Model {
  public id!: number;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      tableName: "users",
      sequelize: database,
    }
);
  
User.sync({ force: true });