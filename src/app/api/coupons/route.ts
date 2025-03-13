import { NextRequest, NextResponse } from "next/server";
import Coupon from "@/models/Coupon";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { name, assignedTo, quantity, discount } = await req.json();

        if (!name || !assignedTo || quantity <= 0 || discount <= 0) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const newCoupon = new Coupon({ name, assignedTo, quantity, discount });
        await newCoupon.save();

        return NextResponse.json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const coupons = await Coupon.find();
        return NextResponse.json(coupons);
    } catch {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
