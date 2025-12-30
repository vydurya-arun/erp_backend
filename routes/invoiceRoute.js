import express from "express";
import {
  getAllInvoicesWithGST,
  getAllInvoicesWithoutGST,
  createInvoiceWithGST,
  createInvoiceWithoutGST,
  updateInvoiceWithGST,
  updateInvoiceWithoutGST,
  deleteInvoiceWithGST,
  deleteInvoiceWithoutGST,
  getNextInvoiceNumberForWithGst,
  getNextInvoiceNumberForWithoutGst,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/with-gst", getAllInvoicesWithGST);
router.post("/with-gst", createInvoiceWithGST);
router.put("/with-gst/:id", updateInvoiceWithGST);
router.delete("/with-gst/:id", deleteInvoiceWithGST);

router.get("/without-gst", getAllInvoicesWithoutGST);
router.post("/without-gst", createInvoiceWithoutGST);
router.put("/without-gst/:id", updateInvoiceWithoutGST);
router.delete("/without-gst/:id", deleteInvoiceWithoutGST);

router.get("/with-gst/next-number", getNextInvoiceNumberForWithGst);
router.get("/without-gst/next-number", getNextInvoiceNumberForWithoutGst);

export default router;
