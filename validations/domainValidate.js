import Joi from "joi";

/* ---------- Sub Schemas ---------- */

const domainFeaturesSchema = Joi.object({
  inHand: Joi.boolean().default(false),
  domainLock: Joi.boolean().default(false),
  ssl: Joi.boolean().default(false),
  domainPrivacy: Joi.boolean().default(false),
});

const personalMailSchema = Joi.object({
  mailAttached: Joi.boolean().default(false),
  numberOfMails: Joi.number().integer().min(0).allow(null, ""),
  mailCapacity: Joi.string().trim().allow(null, ""),
  mailExpiryDate: Joi.date().allow(null, ""),
});

const renewalHistorySchema = Joi.object({
  date: Joi.date().required(),
  cost: Joi.number().min(0).required(),
});

/* ---------- Main Domain Validation ---------- */

export const domainValidation = Joi.object({
  domainName: Joi.string().trim().lowercase().required(),

  ownerName: Joi.string().trim().required(),

  agent: Joi.string().trim().allow("", null),

  company: Joi.string().trim().allow("", null),

  registrationDate: Joi.date().allow("", null),

  numberOfYears: Joi.number().integer().min(1).allow("", null),

  expiryDate: Joi.date().allow("", null),

  provider: Joi.string().trim().default("GoDaddy"),

  /* ✅ NEW FIELDS START */

  item: Joi.array().items(Joi.string().trim()).default([]),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\-\s()]{7,20}$/)
    .allow("", null)
    .messages({
      "string.pattern.base": "Phone number format is invalid",
    }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .allow("", null),

  /* ✅ NEW FIELDS END */

  dnsProvider: Joi.string().trim().allow("", null),

  domainFeatures: domainFeaturesSchema.default(),

  personalMail: personalMailSchema.default(),

  credentials: Joi.string().allow("", null),

  renewalCost: Joi.number().min(0).allow("", null),

  status: Joi.string()
    .valid("Active", "Expired", "Expiring Soon")
    .default("Active"),

  tags: Joi.array().items(Joi.string().trim()).default([]),

  notes: Joi.string().allow("", null),

  alternateDomains: Joi.array()
    .items(Joi.string().trim().lowercase())
    .default([]),

  renewalHistory: Joi.array().items(renewalHistorySchema).default([]),
});
