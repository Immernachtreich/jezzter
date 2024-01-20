import 'reflect-metadata';
import { User } from '../models/user.model';
import { Sequelize, importModels } from '@sequelize/core';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  // models: await importModels(__dirname + '../models/*.model.{ts,js}'),
  models: [User],
});
