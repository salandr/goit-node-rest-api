import express from "express";
import multer from "multer";
import {
  verifyEmail,
  resendVerificationEmail,
  register,
  login,
  logout,
  getCurrentUser,
  updateAvatar,
} from "../controllers/authControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/current", auth, getCurrentUser);
router.get("/verify/:verificationToken", verifyEmail);
router.post("/verify", resendVerificationEmail);
router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default router;
