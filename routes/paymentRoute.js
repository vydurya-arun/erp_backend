import express from "express";
import {
  createPayment,
  updatePayment,
  deletePayment,
  getPayments,
} from "../controllers/paymentController.js";

const router = express.Router();

// invoiceId = the invoice _id
// paymentId = the payment subdocument _id
// type = "GST" or "NONGST"
router.post("/:type/:invoiceId", createPayment);
router.put("/:type/:invoiceId/:paymentId", updatePayment);
router.delete("/:type/:invoiceId/:paymentId", deletePayment);
router.get("/:type/:invoiceId", getPayments);

export default router;
