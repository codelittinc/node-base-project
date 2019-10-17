exports.loadEnvVars = () => {
  const { NODE_ENV = 'development' } = process.env;
  const envFileName = ".env." + NODE_ENV;
  require("dotenv").config({ path: envFileName })
}