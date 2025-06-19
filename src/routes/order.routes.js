import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { apiKeyVerification } from '../middlewares/api.middleware.js';
import { createOrder, getOrderDetails, getOrdersByUser } from '../controllers/order.controllers.js';

const router = Router();

router.post("/" , isLoggedIn , apiKeyVerification , createOrder)
router.get("/" , isLoggedIn , apiKeyVerification , getOrdersByUser)
router.get("/:id" , isLoggedIn , apiKeyVerification , getOrderDetails)


export default router;