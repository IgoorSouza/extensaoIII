import { Router, type Express } from "express";
import * as authService from "../services/auth-service";
 import { validateRequestBody } from "../middlewares/request-body-validator";
import { authSchema } from "../validators/auth";
import { AuthData } from "../types/auth";

export default function authController(app: Express) {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(authSchema),
    async (req, res, next) => {
      try {
        const authData: AuthData = req.body;
        const response = await authService.login(authData);

        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    }
  );

  app.use("/auth", router);
}
