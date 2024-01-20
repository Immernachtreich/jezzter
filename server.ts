import express from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import { createServer } from 'http';
import { parse } from 'url';
import sequelize from './src/lib/sequelize';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());

  // Your API routes using Sequelize go here

  server.all('*', (req: any, res: any) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;

  sequelize
    .authenticate()
    .then(() => {
      console.log('Database connection established successfully.');
      createServer(server).listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    })
    .catch(error => {
      console.error('Unable to connect to the database:', error);
    });
});
