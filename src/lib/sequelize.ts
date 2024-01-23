import FileChunk from '../models/file-chunks.model';
import File from '../models/file.model';
import { User } from '../models/user.model';
import { Sequelize } from '@sequelize/core';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  models: [User, File, FileChunk],
  pool: { max: 1, min: 0, acquire: 10000 },
});
