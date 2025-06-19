import {Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { generateApiToken, getMe, login, logout, register, verify } from '../controllers/authAndApi.controllers.js';

const router = Router();

router.post("/register",  register)
router.post("/login",  login)
router.get("/logout", isLoggedIn, logout)
router.post("/api-key", isLoggedIn, generateApiToken)
router.get("/me" , isLoggedIn, getMe)
router.get("/verify/:token", verify)


export default router;