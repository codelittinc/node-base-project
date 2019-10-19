import { Sequelize } from 'sequelize';
import { getConnURI } from './credentials';

export const database = new Sequelize(getConnURI(), {
  dialect: 'postgres'
});