import { Sequelize } from 'sequelize';
import { getConnURIWithDatabaseName } from './credentials';

export const database = new Sequelize(getConnURIWithDatabaseName(), {
  dialect: 'postgres'
});
