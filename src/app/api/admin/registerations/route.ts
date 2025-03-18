import { NextResponse } from "next/server";
import GuestDetails from "@/models/Guest";
import Coupon from "@/models/Coupon";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
    try {
        await connectToDatabase();

        const guests = await GuestDetails.find();

        // Combine both collections
        const users = [...guests ];

        // Fetch coupon details for users who have applied a coupon
        const couponCodes = users.map(user => user.appliedCoupon).filter(code => code);

        const coupons = await Coupon.find({ name: { $in: couponCodes } });

        // Map users with coupon details
        const userData = users.map(user => {
            const userCoupon = coupons.find(coupon => coupon.name === user.appliedCoupon);
            return {
                ...user._doc,
                couponDetails: userCoupon ? {
                    name: userCoupon.name,
                    assignedTo: userCoupon.assignedTo,
                    discount: userCoupon.discount
                } : null
            };
        });

        return NextResponse.json(userData);
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
