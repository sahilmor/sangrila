import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },

  address: { type: String },
  whatsapp: { type: String },

  referredBy: { type: String },
  referenceContact: { type: String },

  checkedIn: { type: Boolean, default: false },
});

const GuestSchema = new mongoose.Schema(
  {
    registrationId: {
      type: String,
      unique: true,
      required: true,
    },

    registrationType: {
      type: String,
      enum: ["guest"],
      default: "guest",
    },

    members: [MemberSchema],

    totalMembers: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    totalAfterDiscount: {
      type: Number,
    },

    appliedCoupon: {
      type: String,
      default: "",
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    utrNumber: {
      type: String,
      unique: true,
      sparse: true,
      required: true,
    },

    qrCode: {
      type: String,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },

    qrSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "guestDetails",
    timestamps: true,
  }
);

export default mongoose.models.GuestDetails ||
  mongoose.model("GuestDetails", GuestSchema);