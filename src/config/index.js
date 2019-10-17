const { loadEnvVars } = require('./environment/index');

exports.applyConfig = () => {
    loadEnvVars();
}