import { readFileSync } from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

const privateKey = readFileSync(path.resolve(process.cwd(), 'keys', 'private.key'), 'utf-8');
const publicKey = readFileSync(path.resolve(process.cwd(), 'keys', 'public.key'), 'utf-8');

/**
 * Function that creates a jwt token for a given user ID
 * @param {number} userId - the user ID to be signed
 * @returns {string} - the signed token
 */
export function signToken(userId: number): string {
  return jwt.sign({ userId }, privateKey, { algorithm: 'RS256', expiresIn: '1y' });
}

/**
 * Function that decodes a given token or throws an Error if the token was invalid 
 * @param {string} token - the token to be decoded 
 * @returns {{ userId: string }} - The decoded payload
 * @throws {Error} - If the token is invalid
 */
export function verifyToken(token: string): { userId: number } {
  return jwt.verify(token, publicKey, { algorithms: ['RS256' ] }) as { userId: number }
}
