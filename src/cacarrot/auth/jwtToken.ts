import {sign} from 'jsonwebtoken';
import { UserCredentials } from '../users/dto/userCredentials';

export function createWebToken(userCredentials: UserCredentials) {
  var token = sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
      data: userCredentials,
    },
    process.env.JWT_SECRET,
  );
  return token;
}
