import { User } from '@/models/index';
import { signToken } from '@/util/jwt';
import { compare } from 'bcrypt';
import { Request, Response, Router } from 'express';
import Joi from 'joi';

const router = Router();

/**
 * API for logging the user in
 * @body {{ email: string, password: string }}
 * @response {{ token: string }}
 */
router.post('/login', async (request: Request, response: Response) => {
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

  return response.status(200).send({ token });
});

export default router;
