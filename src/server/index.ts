import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('../../swagger.json');

import { RegisterRoutes } from '../server/routes';

import '@controllers/index';
import { HttpError } from './errors';

const exceptionResolver = (
  err: any,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof HttpError) {
    if (res.headersSent) {
      // important to allow default error handler to close connection if headers already sent
      return next(err);
    }
    res.set('Content-Type', 'application/json');
    res.status(err.statusCode);
    res.json({ error: err.message, code: err.statusCode });
  } else {
    next(err);
  }
};

export function getApp() {
  const { SERVER_PARSER_EXTENDED, SERVER_PARSER_LIMIT } = process.env;

  const app = express();
  app.use(
    bodyParser.urlencoded({
      extended: SERVER_PARSER_EXTENDED === 'true',
      limit: SERVER_PARSER_LIMIT || '2mb'
    })
  );

  app.use(bodyParser.json());
  RegisterRoutes(app);

  app.use(exceptionResolver);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  return app;
}
