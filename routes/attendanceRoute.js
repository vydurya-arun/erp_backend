import express from "express";
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getMyMonthlyAttendance,
  getWeeklySummary,
  getTodayAttendance,
  getAttendanceDetailsForAdmin,
  getMonthlyAttendanceSummaryForAdmin,
  getTodayAttendanceRecent,
} from "../controllers/attendanceController.js";
import { protectRoute, protectRouteMobile } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/checkin", protectRoute, checkIn);
router.post("/checkinMobile", protectRouteMobile, checkIn);
router.post("/checkoutMobile", protectRouteMobile, checkOut);
router.post("/checkout", protectRoute, checkOut);
router.get("/me", protectRoute, getMyAttendance);
router.get("/me/monthly", protectRoute, getMyMonthlyAttendance);
router.get("/weekly-summary", protectRoute, getWeeklySummary);
router.get("/today", protectRoute, getTodayAttendance);
router.get("/todayMob", protectRouteMobile, getTodayAttendance);
router.get("/todayRecent", protectRouteMobile, getTodayAttendanceRecent);
router.get("/admin/details", getAttendanceDetailsForAdmin);
router.get("/admin/monthly", getMonthlyAttendanceSummaryForAdmin);

export default router;
