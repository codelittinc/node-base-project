import { Sequelize } from "sequelize";
import { loadEnvVars } from './env_vars';

loadEnvVars();

const { DB_DATABASE = '', DB_USER = '', DB_PASSWORD = '' } = process.env;

export const database = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: "postgres",
});