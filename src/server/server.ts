import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import express, { NextFunction, Request, Response } from 'express';
import next from 'next';
import initializeExpress from '../config/express';
import { authRouter } from '../routes/index';
import { sequelize } from '../models/index';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

/**
 * Main entry point of the application
 * Server starts here with bot and datbase connection
 * @returns {Promise<void>}
 */
(async function initialize() {
  try {
    await app.prepare();
    const server = express();
    initializeExpress(server, handle);

    await sequelize.authenticate();

    server.use('/auth', authRouter);

    server.use(async (error: any, request: Request, response: Response, next: NextFunction) => {
      console.error(error);
      response.status(error.status || 501).send({ message: error.message });
    });

    server.listen(process.env.PORT ?? 3000, () =>
      console.log(`Server listening on port: ${process.env.PORT ?? 3000}`)
    );
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
})();
