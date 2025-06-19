import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { apiKeyVerification } from "../middlewares/api.middleware.js";
import { createCart, deleteCart, getCart, getCartDetails, updateCart } from "../controllers/cart.controllers.js";

const router = Router();

router.post("/", isLoggedIn , apiKeyVerification , createCart );
router.get ("/", isLoggedIn , apiKeyVerification , getCart );
router.get("/:id", isLoggedIn , apiKeyVerification , getCartDetails );
router.delete("/:id", isLoggedIn , apiKeyVerification , deleteCart );
router.put("/:id", isLoggedIn , apiKeyVerification , updateCart );


export default router;