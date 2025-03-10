import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";
import SchoolDetails from "@/models/School";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const regId = url.searchParams.get("regId");

    if (!regId) {
      return NextResponse.json({ success: false, message: "Invalid request. No registration ID provided." }, { status: 400 });
    }

    const guest = await GuestDetails.findOne({ registrationId: regId });
    const school = await SchoolDetails.findOne({ registrationId: regId });

    if (!guest && !school) {
      return NextResponse.json({ success: false, message: "Invalid QR Code. Registration not found." }, { status: 404 });
    }

    if (guest) {
      return NextResponse.json({
        success: true,
        message: `Welcome, ${guest.name}!`,
        type: "guest",
        data: guest,
      });
    }

    if (school) {
      return NextResponse.json({
        success: true,
        message: `Welcome, ${school.name}!`,
        type: "school",
        data: school,
      });
    }

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, message: "Server error. Please try again." }, { status: 500 });
  }
}
