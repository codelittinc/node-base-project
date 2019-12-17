import { Sequelize } from 'sequelize';
import { getConnURIWithDatabaseName } from './credentials';
import { getConfig } from '@config';

export const database = new Sequelize(getConnURIWithDatabaseName(), {
  pool: {
    max: getConfig().database.maxConnections,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialect: 'postgres',
  logging: getConfig().database.sqlLog,
  ssl: getConfig().database.ssl,
  dialectOptions: {
    ssl: getConfig().database.ssl,
  },
});
