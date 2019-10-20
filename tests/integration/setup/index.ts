import { clearDB } from './clearDB';

beforeEach(() => {
  // @TODO: run it only for integration tests
  return clearDB();
});
