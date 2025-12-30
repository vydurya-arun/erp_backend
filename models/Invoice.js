import mongoose from "mongoose";
import paymentSchema from "./Payment.js";

const productSchema = new mongoose.Schema({
  product: { type: String, required: true },
  description: { type: String },
  qty: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }, // qty * rate
});

const bankDetailsSchema = new mongoose.Schema({
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String },
  ifscCode: { type: String, required: true },
  panNumber: { type: String, required: true },
});

// Define the Tax Schema
const GSTDetailsSchema = new mongoose.Schema(
  {
    gstType: {
      type: String,
      enum: ["IGST", "SGST/CGST"],
      required: true,
    },
    // IGST Fields
    igstPercentage: { type: Number, default: 0 },
    igstAmount: { type: Number, default: 0 },

    // SGST/CGST Fields
    sgstPercentage: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    cgstPercentage: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const invoiceSchemaWithoutGST = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    gst_number: { type: String }, // optional since no GST invoice
    email: { type: String, required: true },
    address: { type: String },
    pincode: { type: String },
    state: { type: String },
    city: { type: String },
    country: { type: String },

    products: [productSchema],

    subtotal: { type: Number, required: true },
    discountType: { tyep: String, enum: ["percentage", "value"] },
    discountPercentage: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    total: { type: Number, required: true },

    grandTotal: { type: Number, required: true },
    roundOff: { type: Number, required: true },

    bankDetails: bankDetailsSchema,

    payments: [paymentSchema],
    payment_status: {
      type: String,
      emum: ["paid", "unpaid", "partially paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const invoiceSchemaWithGST = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    gst_number: { type: String, required: true }, // GST mandatory
    email: { type: String, required: true },
    address: { type: String },
    pincode: { type: String },
    state: { type: String },
    city: { type: String },
    country: { type: String },

    products: [productSchema],

    subtotal: { type: Number, required: true },
    discountType: { type: String, enum: ["percentage", "value"] },
    discountPercentage: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    total: { type: Number, required: true },

    gstDetails: {
      type: GSTDetailsSchema, // Fixed syntax
      required: true,
    },

    grandTotal: { type: Number, required: true },
    roundOff: { type: Number, required: true },

    bankDetails: bankDetailsSchema,

    payments: [paymentSchema],
    payment_status: {
      type: String,
      emum: ["paid", "unpaid", "partially paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

export const InvoiceWithGST =
  mongoose.models.InvoiceWithGST ||
  mongoose.model("InvoiceWithGST", invoiceSchemaWithGST);

export const InvoiceWithoutGST =
  mongoose.models.InvoiceWithoutGST ||
  mongoose.model("InvoiceWithoutGST", invoiceSchemaWithoutGST);
