import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SchoolDetails from "@/models/School";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const data = await req.json();
    const registrationId = uuidv4();
    const registrationType = "school";

    const qrCodeURL = await QRCode.toDataURL(`https://event.com/checkin?regId=${registrationId}`);

    const newSchool = new SchoolDetails({
      ...data,
      registrationId,
      registrationType,
      qrCode: qrCodeURL,
    });

    await newSchool.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

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
      message: "Principal/School Coordinator registered successfully!",
    });
  } catch (error) {
    console.error("Error saving principal/School Coordinator :", error);
    return NextResponse.json({ success: false, message: "Failed to register principal/School Coordinator." }, { status: 500 });
  }
}
