import { NextRequest, NextResponse } from "next/server";
import GuestDetails from "@/models/Guest";

export async function POST(req: NextRequest) {
  try {
    const { regId } = await req.json();
    if (!regId) return NextResponse.json({ success: false, message: "Missing registration ID" }, { status: 400 });

    const guest = await GuestDetails.findOneAndUpdate(
      { registrationId: regId }, 
      { checkedIn: true },        
      { new: true }               
    );

    if (!guest) {
      return NextResponse.json({ success: false, message: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Check-in successful", guest });
  } catch {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
