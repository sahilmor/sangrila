import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

interface Params {
  params: Promise<{ code: string }>;
}

// ✅ GET: Fetch Coupon Details
export async function GET(req: NextRequest, props: Params) {
  const params = await props.params;
  await connectToDatabase();

  try {
    const couponCode = params.code;

    if (!couponCode) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ name: couponCode });

    if (!coupon || coupon.quantity <= 0) {
      return NextResponse.json({ error: "Invalid, expired, or out-of-stock coupon" }, { status: 404 });
    }

    return NextResponse.json({ success: true, discount: coupon.discount, quantity: coupon.quantity }, { status: 200 });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json({ error: "Server error", details: (error as Error).message }, { status: 500 });
  }
}

// ✅ PATCH: Decrement Coupon Quantity
export async function PATCH(req: NextRequest, props: Params) {
  const params = await props.params;
  await connectToDatabase();

  try {
    const couponCode = params.code;

    if (!couponCode) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ name: couponCode });

    if (!coupon || coupon.quantity <= 0) {
      return NextResponse.json({ error: "Invalid, expired, or out-of-stock coupon" }, { status: 404 });
    }

    // Reduce the quantity by 1
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { name: couponCode },
      { $inc: { quantity: -1 } }, // Decrease by 1
      { new: true } // Return updated document
    );

    if (!updatedCoupon) {
      return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
    }

    return NextResponse.json({ success: true, remaining: updatedCoupon.quantity }, { status: 200 });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Failed to update coupon", details: (error as Error).message }, { status: 500 });
  }
}
