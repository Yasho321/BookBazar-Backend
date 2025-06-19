import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { apiKeyVerification } from "../middlewares/api.middleware.js";
import { addToCart, createCart, deleteCart, deleteFromCart, getCart, getCartDetails } from "../controllers/cart.controllers.js";

const router = Router();

router.post("/", isLoggedIn , apiKeyVerification , createCart );
router.get ("/", isLoggedIn , apiKeyVerification , getCart );
router.get("/:id", isLoggedIn , apiKeyVerification , getCartDetails );
router.delete("/:id", isLoggedIn , apiKeyVerification , deleteCart );
router.put("/add/:id", isLoggedIn , apiKeyVerification , addToCart );
router.delete ("/remove/:id", isLoggedIn , apiKeyVerification , deleteFromCart );


export default router;