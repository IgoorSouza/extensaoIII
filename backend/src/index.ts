import express from "express";
import cors from "cors";
import customerController from "./controllers/customer-controller";
import { handleException } from "./middlewares/exception-handler";
import purchaseController from "./controllers/purchase-controller";
import paymentController from "./controllers/payment-controller";
import authController from "./controllers/auth-controller";
import { createAdmin } from "./seed/admin";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

authController(app);
customerController(app);
purchaseController(app);
paymentController(app);

app.use(handleException);

createAdmin();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}!`));
