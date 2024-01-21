import 'reflect-metadata';
import express, { Request, Response } from 'express';
import next from 'next';
import { parse } from 'url';
import { sequelize } from '../lib/sequelize';
import { bot } from '../lib/telegram';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

(async function initialize() {
  try {
    await app.prepare();

    const server = express();
    server.all('*', (request: Request, response: Response) => {
      const parsedUrl = parse(request.url, true);

      handle(request, response, parsedUrl);
    });

    await sequelize.authenticate();
    console.log('Connection established to database');

    server.listen(process.env.PORT ?? 3000, () =>
      console.log(`Server listening on port: ${process.env.PORT ?? 3000}`)
    );
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
})();
