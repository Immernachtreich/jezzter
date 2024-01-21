import { User } from '@/models/index';
import Joi from 'joi';
import { compare } from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { signToken } from '@/util/jwt';

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
    if (!user) throw new Error('Invalid user details');

    const isPasswordCorrect = await compare(request.body.password, user.password);
    if (!isPasswordCorrect) throw new Error('Invalid user details');

    const token = signToken(user.id);

    response.status(200).send({ token });
  } catch (error: any) {
    console.error(error);
    response.status(500).send({ message: error.message });
  }
};

export default handler;
