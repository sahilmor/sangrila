import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const data = await req.json();
    const registrationId = uuidv4();
    const registrationType = "guest";

    const qrCodeURL = await QRCode.toDataURL(`https://sangrila2k25.vercel.app/checkin?regId=${registrationId}`);

    const newGuest = new GuestDetails({
      ...data,
      registrationId,
      registrationType,
      qrCode: qrCodeURL,
    });

    await newGuest.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to user
    await transporter.sendMail({
      from: `"Sangrila 2k25" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Sangrila 2k25 Registration Confirmation",
      html: `
        <h2>Welcome, ${data.name}!</h2>
        <p>Your registration for Sangrila 2k25 is successful.</p>
        <p>Your Registration ID: <strong>${registrationId}</strong></p>
        <p>After verifying your payment, your check-in ticket will be sent to your email.</p>
        <p>We look forward to seeing you at the event!</p>
      `,
    });

    // Notify admin about new registration
    await transporter.sendMail({
      from: `"Sangrila 2k25" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Guest Registered",
      html: `
        <h3>A New Guest has Registered</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Registration Type:</strong> ${registrationType}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      registrationId,
      message: "Guest registered successfully! Check-in ticket will be provided after payment verification.",
    });
  } catch (error) {
    console.error("Error saving guest:", error);
    return NextResponse.json({ success: false, message: "Failed to register guest." }, { status: 500 });
  }
}
