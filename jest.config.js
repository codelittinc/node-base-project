module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: './tests/.*.test.ts$',
  globalSetup: './tests/setup/truncate.ts'
};