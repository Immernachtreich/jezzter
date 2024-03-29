import { verifyToken } from '../util/jwt';
import type { NextFunction, Request, Response } from 'express';
import { User } from '../models/index';

/**
 * Middleware for authenticating user.
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export async function authenticate(request: Request, response: Response, next: NextFunction) {
  if (!request.headers.authorization) throw new Error('Authorization header missing');

  const { userId } = verifyToken(request.headers.authorization);

  const user = await User.findByPk(userId);
  if (!user) throw new Error(`User with id ${userId} not found. Invalid token or deleted user`);

  request.user = user;

  next();
}
