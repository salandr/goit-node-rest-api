import express from "express";
import auth from "../middleware/auth.js";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);

export default router;
