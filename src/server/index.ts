import * as express from 'express'
import * as bodyParser from 'body-parser'

export function getApp() {
  const { SERVER_PARSER_EXTENDED, SERVER_PARSER_LIMIT } = process.env;

  const app = express()
  app.use(bodyParser.urlencoded({
    extended: SERVER_PARSER_EXTENDED === "true",
    limit: SERVER_PARSER_LIMIT || '2mb',
  }))

  app.use(bodyParser.json())

  return app;
}