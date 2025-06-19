import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { addReview, deleteReview, getAllReviewsOfBook } from "../controllers/review.controllers.js";

const router = Router(); 

router.post("/:bookId" ,isLoggedIn, addReview)
router.get("/:bookId" ,isLoggedIn, getAllReviewsOfBook)
router.delete("/:id",isLoggedIn, deleteReview)

export default router;