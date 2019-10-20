import { Pool } from 'pg';

import {
  getConnURIWithDatabaseName,
  getDatabaseConfig
} from '../../src/db/credentials';

export function createDatabase() {
  const { databaseName } = getDatabaseConfig();

  const pool = new Pool({
    connectionString: getConnURIWithDatabaseName()
  });

  pool.query('CREATE DATABASE ' + databaseName, err => {
    console.log('Error while creating database: ' + err);
  });
}

createDatabase();
