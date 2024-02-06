import FileChunk from '../models/file-chunks.model';
import File from '../models/file.model';
import { User } from '../models/user.model';
import { Sequelize } from '@sequelize/core';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PGHOST,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  dialectOptions: { ssl: true },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  models: [User, File, FileChunk],
  pool: { max: 1, min: 1, acquire: 10000 },
});
