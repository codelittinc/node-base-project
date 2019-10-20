import { loadEnvVars } from '../config/initializers/envVars';

const getConfig = () => {
  const { DB_DATABASE, DB_USER, DB_PASSWORD, DB_HOST } = process.env;
  const base = {
    user: DB_USER || 'postgres',
    pass: DB_PASSWORD || 'postgres',
    host: DB_HOST
  };

  const development = {
    ...base,
    databaseName: 'node_graphql_dev'
  };

  const test = {
    ...base,
    databaseName: 'node_graphql_test'
  };

  const production = {
    ...base,
    databaseName: DB_DATABASE || 'node_graphql'
  };

  const { NODE_ENV } = process.env;

  if (NODE_ENV == 'production') {
    return production;
  } else if (NODE_ENV == 'test') {
    return test;
  }

  return development;
};

export function getConnURI() {
  loadEnvVars();

  const { user, pass, host, databaseName } = getConfig();

  return `postgres://${user}:${pass}@${host}:5432/${databaseName}`;
}