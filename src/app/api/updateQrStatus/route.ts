import { NextResponse } from "next/server";
import GuestDetails from "@/models/Guest";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        await connectToDatabase(); // Ensure DB connection

        const { registrationId } = await req.json();

        if (!registrationId) {
            return NextResponse.json({ success: false, message: "Registration ID is required" }, { status: 400 });
        }

        const user =
            (await GuestDetails.findOne({ registrationId }))

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Update the qrSent status to true
        user.qrSent = true;
        await user.save();

        return NextResponse.json({ success: true, message: "QR status updated successfully" });
    } catch (error) {
        console.error("Error updating QR status:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
