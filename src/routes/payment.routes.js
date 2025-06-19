import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { apiKeyVerification } from "../middlewares/api.middleware.js";
import { createPayment, verifyPayment } from "../controllers/payment.controllers.js";

const router = Router();

router.post("/create", isLoggedIn, apiKeyVerification, createPayment)
router.post("/verify", isLoggedIn, apiKeyVerification, verifyPayment)

export default router;