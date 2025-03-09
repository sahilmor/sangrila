import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema(
  {
    name: {type: String},
    email: {type: String},
    schoolName: {type: String},
    whatsapp: {type: String},
    additionalMembers: Number,
    reference: {type: String},
    registrationId: {type: String},
    registerationType: {type: String},
    qrCode: {type: String},
    checkedIn: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "schoolDetails", timestamps: true },
);

export default mongoose.models.SchoolDetails || mongoose.model("SchoolDetails", SchoolSchema);
