import express from "express";
import {
  RegisterUser,
  authControllers,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/login", authControllers);
router.post("/register", RegisterUser);

export default router;
