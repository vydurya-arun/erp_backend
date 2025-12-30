import mongoose from "mongoose";

/* ---------- Sub Schemas ---------- */

// Domain features
const DomainFeaturesSchema = new mongoose.Schema(
  {
    inHand: { type: Boolean, default: false },
    domainLock: { type: Boolean, default: false },
    ssl: { type: Boolean, default: false },
    domainPrivacy: { type: Boolean, default: false },
  },
  { _id: false }
);

// Personal mail
const PersonalMailSchema = new mongoose.Schema(
  {
    mailAttached: { type: Boolean, default: false },
    numberOfMails: { type: Number }, // e.g. count
    mailCapacity: { type: String }, // e.g. "5 GB", "10 GB"
    mailExpiryDate: { type: Date },
  },
  { _id: false }
);

// Renewal history
const RenewalHistorySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    cost: { type: Number, required: true },
  },
  { _id: false }
);

/* ---------- Main Schema ---------- */

const DomainSchema = new mongoose.Schema(
  {
    domainName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    agent: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    registrationDate: {
      type: Date,
    },

    numberOfYears: {
      type: Number, // used for expiry calculation
      min: 1,
    },

    expiryDate: {
      type: Date,
    },

    provider: {
      type: String,
      default: "GoDaddy",
    },

    item: [String],

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    dnsProvider: {
      type: String,
      trim: true,
    },

    domainFeatures: {
      type: DomainFeaturesSchema,
      default: () => ({}),
    },

    personalMail: {
      type: PersonalMailSchema,
      default: () => ({}),
    },

    credentials: {
      type: String, // encrypt later if needed
    },

    renewalCost: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Expired", "Expiring Soon"],
      default: "Active",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    notes: {
      type: String,
    },

    alternateDomains: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    renewalHistory: [RenewalHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.models.Domain || mongoose.model("Domain", DomainSchema);
