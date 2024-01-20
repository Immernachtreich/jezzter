import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/models/index';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await User.create({
    name: 'Test User',
    email: 'test@test.com',
    password: 'Test@123',
  });

  res.status(200).json({ message: 'Hello from your API route!' });
};

export default handler;
