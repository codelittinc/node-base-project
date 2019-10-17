import * as express from 'express'
import * as bodyParser from 'body-parser'
import { applyConfig } from './config'

export function start() {
  applyConfig();

  const { SERVER_PORT, SERVER_PARSER_EXTENDED, SERVER_PARSER_LIMIT } = process.env;

  const app = express()
  app.use(bodyParser.urlencoded({
    extended: SERVER_PARSER_EXTENDED === "true",
    limit: SERVER_PARSER_LIMIT || '2mb',
  }))

  app.use(bodyParser.json())

  const PORT = SERVER_PORT || 9090;

  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
}