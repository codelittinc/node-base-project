const express = require("express");

const { applyConfig } = require('./config')

const start = () => {
  applyConfig();

  const app = express();

  const PORT = process.env.SERVER_PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
}

exports.start = start;