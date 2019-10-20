module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: './tests/.*.test.ts$',
  setupFilesAfterEnv: ['./tests/setup/beforeEach.ts']
};