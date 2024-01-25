import jwt from 'jsonwebtoken';

/**
 * Function that creates a jwt token for a given user ID
 * @param {number} userId - the user ID to be signed
 * @returns {string} - the signed token
 */
export function signToken(userId: number): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1y' });
}

/**
 * Function that decodes a given token or throws an Error if the token was invalid
 * @param {string} token - the token to be decoded
 * @returns {{ userId: string }} - The decoded payload
 * @throws {Error} - If the token is invalid
 */
export function verifyToken(token: string): { userId: number } {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
}
