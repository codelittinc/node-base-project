import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { Server } from 'typescript-rest';
import * as swaggerUi from 'swagger-ui-express';
import * as Controllers from '@controllers/index';
import exceptionResolver from './exception.resolver';

const swaggerDocument = require('../../swagger.json');

export function getApp() {
  const { SERVER_PARSER_EXTENDED, SERVER_PARSER_LIMIT } = process.env;

  const app: express.Application = express();
  app.use(
    bodyParser.urlencoded({
      extended: SERVER_PARSER_EXTENDED === 'true',
      limit: SERVER_PARSER_LIMIT || '2mb'
    })
  );
  app.use(cors());

  app.use(bodyParser.json());

  // Setup swagger
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/docs.json', (_req, res) => res.send(swaggerDocument));

  Object.values(Controllers).map(controller => {
    Server.buildServices(app, controller);
  });

  app.use(exceptionResolver);

  return app;
}
