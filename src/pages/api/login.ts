import { User } from '@/models/index';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    await schema.validateAsync(request.body, { abortEarly: false });

    const user = await User.withScope('passwordIncluded').findOne({
      where: { email: request.body.email },
    });
    if (!user || user.password !== request.body.password) throw Error('Invalid user details');

    response.status(200).send(user);
  } catch (error: any) {
    console.error(error);
    response.status(500).send({ message: error.message });
  }
};

export default handler;
