import * as path from 'path';
import * as fs from 'fs';
import * as Umzug from 'umzug';
import { database } from '@db';
import { Sequelize } from 'sequelize';
import { loadEnvVars } from './envVars';

export const sqlResolver = (path: string) => {
  const downPath = path.replace('up', 'down');
  return {
    up: () => database.query(fs.readFileSync(path, 'utf-8')),
    down: () => database.query(fs.readFileSync(downPath, 'utf-8'))
  };
};

export default function({
  pattern = /\.up.sql$/,
  directory = 'migrations',
  resolver
}) {
  const migrationsPath = path.join(__dirname, '../../db/', directory);
  loadEnvVars();
  return new Umzug({
    migrations: {
      path: migrationsPath,
      params: [database.getQueryInterface(), Sequelize],
      pattern,
      customResolver: resolver
    },
    storage: 'sequelize',
    storageOptions: {
      database,
      sequelize: database
    }
  });
}
