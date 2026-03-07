import { NextRequest, NextResponse } from "next/server";
import GuestDetails from "@/models/Guest";

export async function POST(req: NextRequest) {
  try {
    const { regId, memberIndex } = await req.json();

    if (!regId || memberIndex === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing registration ID or member index" },
        { status: 400 }
      );
    }

    const guest = await GuestDetails.findOne({ registrationId: regId });

    if (!guest) {
      return NextResponse.json({ success: false, message: "Guest not found" });
    }

    if (guest.members[memberIndex].checkedIn) {
      return NextResponse.json({
        success: false,
        message: "Member already checked in"
      });
    }

    guest.members[memberIndex].checkedIn = true;

    await guest.save();

    return NextResponse.json({
      success: true,
      message: "Member checked in successfully",
      guest
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}