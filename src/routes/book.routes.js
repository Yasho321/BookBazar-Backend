import {Router } from 'express';
import { isAdmin, isLoggedIn } from '../middlewares/auth.middleware.js';
import { apiKeyVerification } from '../middlewares/api.middleware.js';
import { addBooks, deleteBook, getAllBooks, getBook, updateBook } from '../controllers/book.controllers.js';
import upload from '../middlewares/upload.js';

const router = Router();

router.post("/", isLoggedIn , apiKeyVerification ,isAdmin,upload.single('cover'), addBooks)
router.get("/", isLoggedIn , apiKeyVerification , getAllBooks)
router.get("/:id", isLoggedIn , apiKeyVerification , getBook)
router.put("/:id", isLoggedIn , apiKeyVerification ,isAdmin,upload.single('cover'), updateBook)
router.delete("/:id", isLoggedIn , apiKeyVerification ,isAdmin, deleteBook)


export default router;