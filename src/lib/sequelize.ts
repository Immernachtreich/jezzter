import { User } from '../models/user.model';
import { Sequelize } from '@sequelize/core';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  models: [User],
});
