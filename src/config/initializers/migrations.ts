import * as path from 'path';
import * as fs from 'fs';
import * as Umzug from 'umzug';
import { database } from '../../db';
import { Sequelize } from 'sequelize';
import { loadEnvVars } from './envVars';

const migrationsPath = path.join(__dirname, '../../db/migrations');

export default function() {
  loadEnvVars();
  return new Umzug({
    migrations: {
      path: migrationsPath,
      params: [database.getQueryInterface(), Sequelize],
      pattern: /\.up.sql$/,
      customResolver: path => {
        const downPath = path.replace('up', 'down');
        return {
          up: () => database.query(fs.readFileSync(path, 'utf-8')),
          down: () => database.query(fs.readFileSync(downPath, 'utf-8'))
        };
      }
    },
    storage: 'sequelize',
    storageOptions: {
      database,
      sequelize: database
    }
  });
}
