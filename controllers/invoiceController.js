import { InvoiceWithGST, InvoiceWithoutGST } from "../models/Invoice.js";
import {
  invoiceWithoutGSTValidation,
  invoiceWithGSTValidation,
} from "../validations/invoiceValidate.js";

export const createInvoiceWithGST = async (req, res) => {
  try {
    const { error } = invoiceWithGSTValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });
    }

    const invoice = await InvoiceWithGST.create(req.body);

    res.status(201).json({
      success: true,
      message: "Invoice (with GST) created successfully",
      invoice,
    });
  } catch (err) {
    console.error("Error creating GST invoice:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createInvoiceWithoutGST = async (req, res) => {
  try {
    const { error } = invoiceWithoutGSTValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });
    }

    const invoice = await InvoiceWithoutGST.create(req.body);

    res.status(201).json({
      success: true,
      message: "Invoice (without GST) created successfully",
      invoice,
    });
  } catch (err) {
    console.error("Error creating non-GST invoice:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateInvoiceWithGST = async (req, res) => {
  try {
    const { error } = invoiceWithGSTValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });
    }

    const invoice = await InvoiceWithGST.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.status(200).json({
      success: true,
      message: "GST invoice updated successfully",
      invoice,
    });
  } catch (err) {
    console.error("Error updating GST invoice:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateInvoiceWithoutGST = async (req, res) => {
  try {
    const { error } = invoiceWithoutGSTValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });
    }

    const invoice = await InvoiceWithoutGST.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice,
    });
  } catch (err) {
    console.error("Error updating non-GST invoice:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteInvoiceWithGST = async (req, res) => {
  try {
    const invoice = await InvoiceWithGST.findByIdAndDelete(req.params.id);

    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.status(200).json({ success: true, message: "GST invoice deleted" });
  } catch (err) {
    console.error("Error deleting GST invoice:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteInvoiceWithoutGST = async (req, res) => {
  try {
    const invoice = await InvoiceWithoutGST.findByIdAndDelete(req.params.id);

    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    res.status(200).json({ success: true, message: "Invoice deleted" });
  } catch (err) {
    console.error("Error deleting non-GST invoice:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllInvoicesWithGST = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      date = "",
      page = 1,
      limit = 20,
    } = req.query;
    const query = {};

    // 🔍 Text Search (search across: category, vendor, notes)
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { invoiceNumber: { $regex: search, $options: "i" } },
        { referenemailceId: { $regex: search, $options: "i" } },
      ];
    }

    // 🏷️ Filter: status
    if (status) {
      query.payment_status = status;
    }

    // 🏷️ Filter: Category
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    const [invoices, total] = await Promise.all([
      InvoiceWithGST.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      InvoiceWithGST.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      invoices,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (err) {
    console.error("Error fetching GST invoices:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllInvoicesWithoutGST = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      date = "",
      page = 1,
      limit = 20,
    } = req.query;
    const query = {};

    // 🔍 Text Search (search across: category, vendor, notes)
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { invoiceNumber: { $regex: search, $options: "i" } },
        { referenemailceId: { $regex: search, $options: "i" } },
      ];
    }

    // 🏷️ Filter: status
    if (status) {
      query.payment_status = status;
    }

    // 🏷️ Filter: Category
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    const [invoices, total] = await Promise.all([
      InvoiceWithoutGST.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      InvoiceWithoutGST.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      invoices,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (err) {
    console.error("Error fetching non-GST invoices:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getNextInvoiceNumberForWithGst = async (req, res) => {
  try {
    const lastInvoice = await InvoiceWithGST.findOne()
      .sort({ createdAt: -1 })
      .select("invoiceNumber");

    let nextNumber = 10001;

    console.log(lastInvoice);

    if (lastInvoice?.invoiceNumber) {
      const numeric = parseInt(lastInvoice.invoiceNumber.replace("#", ""));
      nextNumber = numeric + 1;
    }

    res.json({
      success: true,
      invoiceNumber: `#${nextNumber}`,
    });
  } catch (err) {
    console.error("Error fetching nextinvoice number for with gst:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getNextInvoiceNumberForWithoutGst = async (req, res) => {
  try {
    const lastInvoice = await InvoiceWithoutGST.findOne()
      .sort({ createdAt: -1 })
      .select("invoiceNumber");

    let nextNumber = 10001;

    if (lastInvoice?.invoiceNumber) {
      const numeric = parseInt(lastInvoice.invoiceNumber.replace("#", ""));
      nextNumber = numeric + 1;
    }

    res.json({
      success: true,
      invoiceNumber: `#${nextNumber}`,
    });
  } catch (err) {
    console.error("Error fetching nextinvoice number for with gst:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
