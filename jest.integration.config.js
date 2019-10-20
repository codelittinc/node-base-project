module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: './tests/integration/.*.test.ts$',
  setupFilesAfterEnv: ['./tests/integration/setup/index.ts']
};