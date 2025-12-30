import Joi from "joi";

// --- Sub-schema Validations ---

export const paymentValidation = Joi.object({
  mode: Joi.string()
    .valid("Cash", "Cheque", "NEFT/RTGS", "Online", "Wave Off")
    .required(),
  date: Joi.date().required(),
  amount: Joi.number().required(),
  chequeNo: Joi.when("mode", {
    is: "Cheque",
    then: Joi.string().required(),
    otherwise: Joi.string().allow("", null),
  }),
  chequeBankName: Joi.when("mode", {
    is: "Cheque",
    then: Joi.string().required(),
    otherwise: Joi.string().allow("", null),
  }),
  transactionId: Joi.when("mode", {
    is: Joi.valid("NEFT/RTGS", "Online"),
    then: Joi.string().required(),
    otherwise: Joi.string().allow("", null),
  }),
});

const productValidation = Joi.object({
  product: Joi.string().required(),
  description: Joi.string().allow("", null),
  qty: Joi.number().min(1).required(),
  rate: Joi.number().min(0).required(),
  amount: Joi.number().required(),
});

const bankValidation = Joi.object({
  accountHolderName: Joi.string().required(),
  accountNumber: Joi.string().required(),
  bankName: Joi.string().required(),
  branchName: Joi.string().allow("", null),
  ifscCode: Joi.string().required(),
  panNumber: Joi.string().required(),
});

// New GST Details Validation
const gstDetailsValidation = Joi.object({
  gstType: Joi.string().valid("IGST", "SGST/CGST").required(),

  // IGST logic: required if type is IGST
  igstPercentage: Joi.number().default(0),
  igstAmount: Joi.number().default(0),

  // CGST/SGST logic: required if type is SGST/CGST
  sgstPercentage: Joi.number().default(0),
  sgstAmount: Joi.number().default(0),
  cgstPercentage: Joi.number().default(0),
  cgstAmount: Joi.number().default(0),
});

// --- Main Invoice Validations ---

export const invoiceWithoutGSTValidation = Joi.object({
  clientName: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  date: Joi.date().required(),
  gst_number: Joi.string().allow("", null),
  email: Joi.string().email().required(),
  address: Joi.string().allow("", null),
  pincode: Joi.string().allow("", null),
  state: Joi.string().allow("", null),
  city: Joi.string().allow("", null),
  country: Joi.string().allow("", null),

  products: Joi.array().items(productValidation).min(1).required(),

  subtotal: Joi.number().required(),
  discountType: Joi.string().valid("percentage", "value").required(),
  discount: Joi.number().default(0),

  total: Joi.number().required(),
  roundOff: Joi.number().required(),
  grandTotal: Joi.number().required(),

  bankDetails: bankValidation.required(),
  payments: Joi.array().items(paymentValidation).default([]),
  payment_status: Joi.string().valid("paid", "unpaid").default("unpaid"),
});

export const invoiceWithGSTValidation = Joi.object({
  clientName: Joi.string().required(),
  invoiceNumber: Joi.string().required(),
  date: Joi.date().required(),
  gst_number: Joi.string().required(), // Mandatory for GST Invoice
  email: Joi.string().email().required(),
  address: Joi.string().allow("", null),
  pincode: Joi.string().allow("", null),
  state: Joi.string().allow("", null),
  city: Joi.string().allow("", null),
  country: Joi.string().allow("", null),

  products: Joi.array().items(productValidation).min(1).required(),

  subtotal: Joi.number().required(),
  discountType: Joi.string().valid("percentage", "value").required(),
  discountPercentage: Joi.number().default(0),
  discount: Joi.number().default(0),

  total: Joi.number().required(),

  // Nested GST details matching the schema
  gstDetails: gstDetailsValidation.required(),

  roundOff: Joi.number().required(),
  grandTotal: Joi.number().required(),

  bankDetails: bankValidation.required(),
  payments: Joi.array().items(paymentValidation).default([]),
  payment_status: Joi.string().valid("paid", "unpaid").default("unpaid"),
});
