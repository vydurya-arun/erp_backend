import { InvoiceWithGST, InvoiceWithoutGST } from "../models/Invoice.js";
import paymentSchema from "../models/Payment.js";
import { paymentValidation } from "../validations/invoiceValidate.js"; // Joi validation

// Helper to get the invoice model based on type
const getInvoiceModel = (type) => {
  return type === "GST" ? InvoiceWithGST : InvoiceWithoutGST;
};

const calculatePaymentStatus = (invoice) => {
  const totalPaid = invoice.payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  const totalAmount = Number(invoice.roundOff || 0);

  if (totalPaid === 0) return "unpaid";
  if (totalPaid >= totalAmount) return "paid";
  return "partially paid";
};

// ============================
// Create Payment
// ============================
export const createPayment = async (req, res) => {
  try {
    const { invoiceId, type } = req.params;

    const { error } = paymentValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const InvoiceModel = getInvoiceModel(type);
    const invoice = await InvoiceModel.findById(invoiceId);

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    // ➕ Add payment
    invoice.payments.push(req.body);

    // 🔄 Update payment_status
    invoice.payment_status = calculatePaymentStatus(invoice);

    await invoice.save();

    res.status(201).json({
      success: true,
      message: "Payment added",
      payments: invoice.payments,
      payment_status: invoice.payment_status,
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// Update Payment
// ============================
export const updatePayment = async (req, res) => {
  try {
    const { invoiceId, paymentId, type } = req.params;

    const { error } = paymentValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const InvoiceModel = getInvoiceModel(type);
    const invoice = await InvoiceModel.findById(invoiceId);

    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const payment = invoice.payments.id(paymentId);
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    // ✏️ Update payment
    payment.set(req.body);

    // 🔄 Recalculate payment status
    invoice.payment_status = calculatePaymentStatus(invoice);

    await invoice.save();

    res.status(200).json({
      success: true,
      message: "Payment updated",
      payments: invoice.payments,
      payment_status: invoice.payment_status,
    });
  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// Delete Payment
// ============================
export const deletePayment = async (req, res) => {
  try {
    const { invoiceId, paymentId, type } = req.params;

    const InvoiceModel = getInvoiceModel(type);
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    const payment = invoice.payments.id(paymentId);
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    payment.remove();
    await invoice.save();

    res.status(200).json({
      success: true,
      message: "Payment deleted",
      payments: invoice.payments,
    });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ============================
// Get All Payments for an Invoice
// ============================
export const getPayments = async (req, res) => {
  try {
    const { invoiceId, type } = req.params;

    const InvoiceModel = getInvoiceModel(type);
    const invoice = await InvoiceModel.findById(invoiceId);
    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.status(200).json({ success: true, payments: invoice.payments });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
