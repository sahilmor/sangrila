import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema(
  {
    name: {type: String},
    email: {type: String},
    adress: {type: String},
    whatsapp: {type: String},
    additionalMembers: Number,
    reference: {type: String},
    registrationId: {type: String},
    registerationType: {type: String},
    qrCode: {type: String},
    checkedIn: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "guestDetails", timestamps: true },
);

export default mongoose.models.GuestDetails || mongoose.model("GuestDetails", GuestSchema);
