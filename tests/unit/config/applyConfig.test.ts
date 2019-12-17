import { applyConfig } from '@config';
import { start } from '../../../src';

jest.mock('@config', () => ({
  applyConfig: jest.fn(),
  getConfig: () => ({
    database: {
      sqlLog: false,
    },
  }),
}));

it('On startup, calls the applyConfig', async () => {
  const server = start();
  expect(applyConfig).toHaveBeenCalled();
  server.close();
});
