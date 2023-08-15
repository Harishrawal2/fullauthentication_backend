import express from "express";
import {
  RegisterUser,
  authControllers,
  logout,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/login", authControllers);
router.post("/register", RegisterUser);
router.post("/logout", logout);
export default router;
