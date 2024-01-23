import { sequelize } from '@/models/index';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (request: NextApiRequest, response: NextApiResponse) {
  try {
    await sequelize.sync({ alter: true });
    response.send({ message: 'Syncronization successful' });
  } catch (error: any) {
    console.error(error);
    response.send({ error: error.message });
  }
}
