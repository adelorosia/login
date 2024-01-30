import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/api/users/register", registerUser);
router.post("/api/users/login", loginUser);
router.delete("/api/users/logout", logoutUser);

export default router;
