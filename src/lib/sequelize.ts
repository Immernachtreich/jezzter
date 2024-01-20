import { Sequelize } from '@sequelize/core';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  host: '127.0.0.1',
});

export default sequelize;
