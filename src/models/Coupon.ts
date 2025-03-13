import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    assignedTo: { type: String, required: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
