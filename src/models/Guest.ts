import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    whatsapp: { type: String, required: true },
    additionalMembers: { type: Number, default: 0 },
    registrationId: { type: String, unique: true, required: true },
    registrationType: { 
      type: String, 
      enum: ["guest", "school"], 
      required: true 
    },
    qrCode: { type: String }, 
    checkedIn: { type: Boolean, default: false },
    qrSent: { type: Boolean, default: false },

    totalAmount: { type: Number, required: true },
    appliedCoupon: { type: String, default: "" },
    utrNumber: { type: String, unique: true, sparse: true },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "verified", "failed"], 
      default: "pending" 
    },
  },
  { collection: "guestDetails", timestamps: true }
);

export default mongoose.models.GuestDetails || mongoose.model("GuestDetails", GuestSchema);
