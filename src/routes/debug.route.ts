import Joi from 'joi';
import { File, FileChunk, User, sequelize } from '../models/index';
import { Response, Router, Request, NextFunction } from 'express';
import { hash } from 'bcrypt';
import { readFileSync } from 'fs';
import { uploadDocument } from '../util/telegram';
import path from 'path';

const router: Router = Router();

/**
 * Middleware to stop any requests in production.
 * @returns {Promise<void>} - Passes the request if environment is development.
 * @throws {Error} - If environment is not production.
 */
router.use(async (request: Request, response: Response, next: NextFunction): Promise<void> => {
  if (process.env.NODE_ENV !== 'development') throw new Error('Cannot use debug in production');
  return next();
});

/**
 * API for syncing all models to the database.
 * DANNGEROUS as it could lead to database wipe.
 * @response {{ message: string }} - Success message.
 * @returns {Promise<Response>} - Success message if syncronization is successful.
 * @throws {Error} - If syncronization fails.
 */
router.get('/sync_models', async (request: Request, response: Response): Promise<Response> => {
  // await File.sync({ force: true });
  // await FileChunk.sync({ force: true });
  await sequelize.sync({ force: true });

  return response.status(200).send({ message: 'Syncronization successful' });
});

/**
 * API for onboarding a new user.
 * Creates a new user in the DB.
 * @body {{ email: string, password: string, name: string }} - The user details
 * @response {{ User }} - The created user.
 * @returns {Promise<Response>}>
 * @throws {Error} - For invalid user details or for failure of user creation.
 */
router.post('/signup', async (request: Request, response: Response): Promise<Response> => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  await schema.validateAsync(request.body);

  const password: string = await hash(request.body.password, 10);

  const user: User = await User.create({
    name: request.body.name,
    email: request.body.email,
    password,
  });

  return response.status(200).send(user);
});

export default router;
