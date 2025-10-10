import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/unauthorized-exception";

const jwtSecret: Secret = process.env.JWT_SECRET!;
const appUrl = process.env.APP_URL!;

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.headers.authorization?.slice(7);
    if (!accessToken)
      throw new UnauthorizedException("Access token not found.");

    try {
      const decoded = jwt.verify(accessToken, jwtSecret) as JwtPayload;
      if (decoded.iss !== appUrl) throw new Error();
    } catch {
      throw new UnauthorizedException("Invalid token.");
    }

    next();
  } catch (error) {
    next(error);
  }
}
