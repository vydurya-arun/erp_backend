import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    country: { type: String },
    product: {
      type: String,
    },
    service: {
      type: String,
    },
    source: {
      type: String,
    },

    status: {
      type: String,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    notes: { type: String },
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

// Safe export to prevent model overwrite errors
const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
