import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";

export async function GET(req: Request) {
  try {

    await connectToDatabase();

    const url = new URL(req.url);
    const regId = url.searchParams.get("regId");

    if (!regId) {
      return NextResponse.json(
        { success: false, message: "Registration ID missing" },
        { status: 400 }
      );
    }

    const guest: any = await GuestDetails.findOne({ registrationId: regId }).lean();

    if (!guest) {
      return NextResponse.json(
        { success: false, message: "Invalid QR Code. Registration not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registration verified",
      type: "guest",

      registrationId: guest.registrationId,

      totalMembers: guest.totalMembers,

      members: guest.members.map((member: any) => ({
        name: member.name,
        email: member.email,
        whatsapp: member.whatsapp,
        checkedIn: member.checkedIn
      }))

    });

  } catch (error) {

    console.error("Verification Error:", error);

    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );

  }
}