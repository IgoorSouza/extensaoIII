import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NotFoundException } from "../exceptions/not-found-exception";
import { AuthData } from "../types/auth";
import * as userService from "./user-service";
import { UnauthorizedException } from "../exceptions/unauthorized-exception";

const jwtSecret = process.env.JWT_SECRET!;
const jwtExpirationTime = process.env.JWT_EXPIRATION_TIME!;
const appUrl = process.env.APP_URL!;

export async function login(authData: AuthData) {
  const user = await userService.getUserByEmail(authData.email);
  if (!user) throw new NotFoundException("User not found.");

  const passwordMatch = await bcrypt.compare(authData.password, user.password);
  if (!passwordMatch) throw new UnauthorizedException("Incorrect password.");

  const token = jwt.sign({ ...user, password: undefined }, jwtSecret, {
    expiresIn: parseInt(jwtExpirationTime),
    issuer: appUrl
  });

  return {
    user: { ...user, password: undefined },
    token,
  };
}
