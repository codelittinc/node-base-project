import { loadEnvVars } from '@config/initializers/envVars';

describe('#loadEnvVars', () => {
  it('loads the DB_DATABASE variable', () => {
    expect(process.env.SERVER_PARSER_LIMIT).toBeFalsy();
    loadEnvVars();
    expect(process.env.SERVER_PARSER_LIMIT).toBeTruthy();
  });
});
