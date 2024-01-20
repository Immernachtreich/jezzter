import { NextApiRequest, NextApiResponse } from 'next';
// import { User } from '@/models/user.model';
import { sequelize } from '@/lib/sequelize';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // await User.create({
  //   name: 'Test User',
  //   email: 'test@test.com',
  //   password: 'Test@123',
  // });
  await sequelize.sync();
  res.status(200).json({ message: 'Hello from your API route!' });
};

export default handler;
