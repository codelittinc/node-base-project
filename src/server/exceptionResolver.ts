import * as express from 'express';
import { Errors } from 'typescript-rest';
import { Error as DBError } from 'sequelize';
import { getConfig } from '@config';

export default function exceptionResolver(
  err: any,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (err instanceof Errors.HttpError) {
    if (res.headersSent) {
      // important to allow default error handler to close connection if headers already sent
      return next(err);
    }
    res.set('Content-Type', 'application/json');
    res.status(err.statusCode);
    res.json({ error: err.message, code: err.statusCode });
  } else if (err instanceof DBError) {
    res.set('Content-Type', 'application/json');
    res.status(400);
    // It could be usefull to get full error on DEV environment but on production just 401 and a message.
    if (getConfig().detailedErrorMessage) {
      res.json({ ...err });
    } else {
      res.json({ error: err.name, code: 400 });
    }
  } else {
    next(err);
  }
}
