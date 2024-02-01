import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import express, { NextFunction, Request, Response } from 'express';
import next from 'next';
import initializeExpress from '../config/express';
import * as expressType from '../types/express';
import { authRouter, debugRouter, fileRouter } from '../routes/index';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

/**
 * Main entry point of the application
 * Server starts here with bot and datbase connection
 * @returns {Promise<void>}
 */
(async function initialize(): Promise<void> {
  try {
    await app.prepare();
    const server = express();
    initializeExpress(server, handle);

    server.use('/debug', debugRouter);
    server.use('/auth', authRouter);
    server.use('/file', fileRouter);

    server.use((error: any, _request: Request, response: Response, _next: NextFunction) => {
      console.error(error);
      response.status(error.statusCode ?? 501).send({ message: error.message });
    });

    server.listen(process.env.PORT ?? 3000, () =>
      console.log(`Server listening on port: ${process.env.PORT ?? 3000}`)
    );
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
})();
