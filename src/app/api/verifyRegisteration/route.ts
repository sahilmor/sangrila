import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const url = new URL(req.url);
    const regId = url.searchParams.get("regId");

    if (!regId) {
      return NextResponse.json({ success: false, message: "Invalid request. No registration ID provided." }, { status: 400 });
    }

    const guest = await GuestDetails.findOne({ registrationId: regId });

    if (!guest) {
      return NextResponse.json({ success: false, message: "Invalid QR Code. Registration not found." }, { status: 404 });
    }


    return NextResponse.json({
      success: true,
      message: `Welcome, ${guest.name}!`,
      guest,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, message: "Server error. Please try again." }, { status: 500 });
  }
}
