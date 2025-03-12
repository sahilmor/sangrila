import { NextRequest, NextResponse } from "next/server";
import GuestDetails from "@/models/Guest";
import SchoolDetails from "@/models/School";

export async function POST(req: NextRequest) {
  try {
    const { regId } = await req.json();
    if (!regId) {
      return NextResponse.json({ success: false, message: "Missing registration ID" }, { status: 400 });
    }

    const guest = await GuestDetails.findOneAndUpdate(
      { registrationId: regId },
      { checkedIn: true },
      { new: true }
    );

    if (!guest) {
      const school = await SchoolDetails.findOneAndUpdate(
        { registrationId: regId },
        { checkedIn: true },
        { new: true }
      );

      if (!school) {
        return NextResponse.json({ success: false, message: "Registration ID not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, message: "Check-in successful (School)", school });
    }

    return NextResponse.json({ success: true, message: "Check-in successful (Guest)", guest });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
