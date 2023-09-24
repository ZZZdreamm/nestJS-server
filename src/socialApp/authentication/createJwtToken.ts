import { sign } from "jsonwebtoken";
import { Profile } from "../profiles/entities/profile.entity";

export function createWebToken(userCredentials: Profile) {
  var token = sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
      data: userCredentials,
    },
    process.env.JWT_SECRET,
  );
  return token;
}
