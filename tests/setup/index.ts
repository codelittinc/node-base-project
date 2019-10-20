import { clearDB } from './clearDB';

module.exports = async function truncate() {
  await clearDB;
};
