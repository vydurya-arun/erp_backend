import express from "express";
import { login, logout, getProfile, EmployeeLoginMobile } from "../controllers/authController.js";
import { protectRoute, protectRouteMobile } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/employee-login", EmployeeLoginMobile);
router.post("/logout", logout);
router.get("/me", protectRouteMobile, getProfile);

export default router;
