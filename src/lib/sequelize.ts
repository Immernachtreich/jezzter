import { User } from '../models/user.model';
import { Sequelize, importModels } from '@sequelize/core';
import path from 'path';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'src/database/database.sqlite'),
  // models: await importModels(__dirname + '/src/models/*.model.{ts,js}'),
  models: [User],
});

(async function authenticateSequelize() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
