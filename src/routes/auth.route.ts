import { compare } from 'bcrypt';
import { Request, Response, Router } from 'express';
import Joi from 'joi';

import { ApiError } from '../util/error';
import { User } from '../models/index';
import { signToken } from '../util/jwt';

const router = Router();

/**
 * API for logging the user in
 * @body {{ email: string, password: string }} - The user details
 * @response {{ token: string }} - The token for the user
 */
router.post('/login', async (request: Request, response: Response): Promise<Response> => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  await schema.validateAsync(request.body, { abortEarly: false });

  const user = await User.withScope('passwordIncluded').findOne({
    where: { email: request.body.email },
  });
  if (!user) throw new ApiError({ message: 'Invalid user details', statusCode: 404 });

  const isPasswordCorrect = await compare(request.body.password, user.password);
  if (!isPasswordCorrect) throw new ApiError({ message: 'Invalid user details', statusCode: 404 });

  const token = signToken(user.id);

  return response.status(200).send({ token });
});

export default router;
