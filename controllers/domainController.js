import Domain from "../models/Domain.js";
import { domainValidation } from "../validations/domainValidate.js";

// ===============================
// CREATE DOMAIN
// ===============================
export const createDomain = async (req, res) => {
  try {
    const { error, value } = domainValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }
    const newDomain = await Domain.create(req.body);

    res.status(201).json({
      success: true,
      message: "Domain created successfully",
      domain: newDomain,
    });
  } catch (error) {
    console.error("❌ Create domain error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ===============================
// GET ALL DOMAINS (WITH SEARCH, FILTER, PAGINATION)
// ===============================
export const getAllDomains = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      item,
      inHand,
      sortBy, // expiryDate | domainName
    } = req.query;

    const query = {};

    // 🔍 Search filter
    if (search) {
      query.$or = [
        { domainName: { $regex: search, $options: "i" } },
        { ownerName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } }, // ✅ works for array
      ];
    }

    // 🟦 Status filter
    if (status) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const next30Days = new Date();
      next30Days.setDate(today.getDate() + 30);

      if (status === "Expired") {
        query.expiryDate = { $lt: today };
      }

      if (status === "Expiring Soon") {
        query.expiryDate = {
          $gte: today,
          $lte: next30Days,
        };
      }

      if (status === "Active") {
        query.expiryDate = { $gt: next30Days };
      }
    }
    if (item) {
      query.item = item;
    }

    // inHand filter
    if (inHand) {
      if (inHand === "inHand") {
        query["domainFeatures.inHand"] = true;
      }

      if (inHand === "outHand") {
        query["domainFeatures.inHand"] = false;
      }
    }

    // 🟧 Sorting logic
    let sortQuery = { createdAt: -1 }; // default

    if (sortBy === "expiryDate") {
      sortQuery = { expiryDate: 1 }; // ascending (closest expiry first)
    }

    if (sortBy === "domainName") {
      sortQuery = { domainName: 1 }; // alphabetical A → Z
    }

    const skip = (page - 1) * limit;

    // 📌 Fetch results + count
    const [domains, total] = await Promise.all([
      Domain.find(query).sort(sortQuery).skip(skip).limit(Number(limit)),
      Domain.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      domains,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("❌ Get all domains error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

// ===============================
// UPDATE DOMAIN
// ===============================
export const updateDomain = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { error, value } = domainValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    const updated = await Domain.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      });
    }
    console.log(updated);
    res.status(200).json({
      success: true,
      message: "Domain updated successfully",
      domain: updated,
    });
  } catch (error) {
    console.error("❌ Update domain error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ===============================
// DELETE DOMAIN
// ===============================
export const deleteDomain = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Domain.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Domain deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete domain error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
