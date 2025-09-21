import { NextFunction, Request, Response } from "express";
import { NotFoundException } from "../exceptions/not-found-exception";
import { ConflictException } from "../exceptions/conflict-exception";

export function handleException(
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  if (
    error instanceof NotFoundException ||
    error instanceof ConflictException
  ) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal Server Error." });
}
