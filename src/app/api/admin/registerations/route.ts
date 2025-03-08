import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";
import SchoolDetails from "@/models/School";

export async function GET() {
  try {
    await connectToDatabase();

    const guestRegistrations = await GuestDetails.find().lean();
    const schoolRegistrations = await SchoolDetails.find().lean();

    const allRegistrations = [...guestRegistrations, ...schoolRegistrations];

    return NextResponse.json(allRegistrations, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch registrations." }, { status: 500 });
  }
}
