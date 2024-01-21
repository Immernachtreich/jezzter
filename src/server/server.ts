import 'reflect-metadata';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import express, { Request, Response } from 'express';
import next from 'next';
import { parse } from 'url';

import { jezzterBot } from '../lib/telegram';
import { sequelize } from '../lib/sequelize';

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

    // Direct all traffic from express to next server
    const server = express();
    server.all('*', (request: Request, response: Response) => {
      const parsedUrl = parse(request.url, true);

      handle(request, response, parsedUrl);
    });

    // Authenticate SQL server
    await sequelize.authenticate();
    console.log('Connection established to database');

    // Start Telegram bot
    await jezzterBot.startPolling();

    server.listen(process.env.PORT ?? 3000, () =>
      console.log(`Server listening on port: ${process.env.PORT ?? 3000}`)
    );
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
})();
