import {sign} from 'jsonwebtoken';
import { UserCredentials } from '../users/dto/userCredentials';

const secret = 'SDWQC12e3aSACDasdsav01jsad01lwapSDf';
export function createWebToken(userCredentials: UserCredentials) {
  var token = sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
      data: userCredentials,
    },
    secret,
  );
  return token;
}
