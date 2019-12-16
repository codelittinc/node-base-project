import 'module-alias/register';

import { Pool } from 'pg';

import { getConnURI, getDatabaseConfig } from '@db/credentials';
import { loadEnvVars } from '@config/initializers/envVars';

const findDatabase = async (pool, databaseName) => {
  return await pool.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${databaseName}');`
  );
};

const getPool = () => {
  return new Pool({
    connectionString: `${getConnURI()}/postgres`,
    ssl: getDatabaseConfig().ssl
  });
};

export async function createDatabase() {
  loadEnvVars();

  const { databaseName } = getDatabaseConfig();

  const pool = getPool();

  const result = await findDatabase(pool, databaseName);

  if (result.rowCount === 0) {
    try {
      console.log(`Creating database ${databaseName}`);

      await pool.query(`CREATE DATABASE ${databaseName}`);
    } catch (err) {
      console.log('There was an error while creating database', err);
    }
  } else {
    console.log('Database already exists.');
  }
}

export async function dropDatabase() {
  loadEnvVars();

  const { databaseName } = getDatabaseConfig();

  const pool = getPool();

  const result = await findDatabase(pool, databaseName);

  if (result.rowCount === 1) {
    try {
      console.log(`Droping database ${databaseName}`);
      await pool.query(`DROP DATABASE ${databaseName}`);
    } catch (err) {
      console.log('There was an error while droping database', err);
    }
  } else {
    console.log('Database doesnt exists.');
  }
}

createDatabase();
