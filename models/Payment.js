import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["Cash", "Cheque", "NEFT/RTGS", "Online", "Wave Off"],
      required: true,
    },

    // COMMON FIELDS
    date: { type: Date, required: true },
    amount: { type: Number, required: true },

    // CASH — no extra fields
    // { date, amount }

    // CHEQUE FIELDS
    chequeNo: { type: String },
    chequeBankName: { type: String },

    // NEFT/RTGS FIELDS
    transactionId: { type: String },

    // ONLINE — also uses transactionId
    // WAVE OFF — still requires date + amount
  },
  { timestamps: true }
);

// Validation Logic Based on Mode
paymentSchema.pre("validate", function (next) {
  const mode = this.mode;

  if (mode === "Cheque") {
    if (!this.chequeNo || !this.chequeBankName) {
      return next(
        new Error(
          "Cheque number and bank name are required for Cheque payments"
        )
      );
    }
  }

  if (mode === "NEFT/RTGS" || mode === "Online") {
    if (!this.transactionId) {
      return next(
        new Error("transactionId is required for NEFT/RTGS and Online payments")
      );
    }
  }

  next();
});

export default paymentSchema;
