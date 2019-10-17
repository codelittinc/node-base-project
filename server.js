const express = require("express");
require("dotenv").config({ path: ".env.local" });

const app = express();

const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});