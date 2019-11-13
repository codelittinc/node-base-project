import 'module-alias/register';

import { clearDB } from './clearDB';

jest.setTimeout(30000);

beforeEach(() => {
  return clearDB();
});
