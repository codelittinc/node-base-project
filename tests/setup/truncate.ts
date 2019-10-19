import { User } from '../../src/models/user.model';

module.exports = async function truncate() {
  console.log('running setup');
  return await Promise.all([User.destroy({ where: {}, force: true })]);
}