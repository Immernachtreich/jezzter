import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

const privateKey = readFileSync(path.resolve(process.cwd(), 'keys', 'private.key'), 'utf-8');

/**
 * Function that creates a jwt token for a given user ID
 * @param {number} userId - the user ID to be signed
 * @returns {string} - the signed token
 */
export function signToken(userId: number): string {
  return jwt.sign({ userId }, privateKey, { algorithm: 'RS256', expiresIn: '1y' });
}
