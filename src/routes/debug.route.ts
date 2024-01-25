import Joi from 'joi';
import { User, sequelize } from '../models/index';
import { Response, Router, Request, NextFunction } from 'express';
import { hash } from 'bcrypt';

const router: Router = Router();

/**
 * Middleware to stop any requests in production.
 * @returns {void} - Passes the request if environment is development.
 * @throws {Error} - If environment is not production.
 */
router.use(async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') throw new Error('Cannot sync models in production');
  return next();
});

router.get('/sync_models', async (request: Request, response: Response): Promise<Response> => {
  await sequelize.sync({ force: true });

  return response.status(200).send({ message: 'Syncronization successful' });
});

router.post('/signup', async (request: Request, response: Response): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  await schema.validateAsync(request.body);

  const password = await hash(request.body.password, 10);

  const user = await User.create({
    name: request.body.name,
    email: request.body.email,
    password,
  });

  return response.status(200).send(user);
});

export default router;
