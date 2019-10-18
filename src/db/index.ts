import { Sequelize } from 'sequelize';
import { loadEnvVars } from '../config/initializers/env_vars';

loadEnvVars();

const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const dbConnURI = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_DATABASE}`;

export const database = new Sequelize(dbConnURI, {
  dialect: 'postgres'
});
