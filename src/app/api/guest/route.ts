import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GuestDetails from "@/models/Guest";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const data = await req.json();
    const registrationId = uuidv4();
    const registerationType = "guest";

    const qrCodeURL = await QRCode.toDataURL(`https://event.com/checkin?regId=${registrationId}`);

    const qrCodeBuffer = Buffer.from(qrCodeURL.split(",")[1], "base64");

    const newGuest = new GuestDetails({
      ...data,
      registrationId,
      registerationType,
      qrCode: qrCodeURL,
    });

    await newGuest.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Use App Password if using Gmail
      },
    });

    await transporter.sendMail({
      from: `"Shangrila 2k25" <${process.env.EMAIL_USER}>`,
      to: data.email,
      subject: "Shangrila 2k25 Registration Confirmation",
      html: `
        <h2>Welcome, ${data.name}!</h2>
        <p>Your registration for Shangrila 2k25 is successful.</p>
        <p>Your Registration ID: <strong>${registrationId}</strong></p>
        <p>Scan the QR code below at the event check-in:</p>
        <img src="cid:qrcode" alt="QR Code" width="200" height="200"/>
        <p>We look forward to seeing you at the event!</p>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeBuffer,
          encoding: "base64",
          cid: "qrcode", // This `cid` will be used in the email HTML
        },
      ],
    });

    await transporter.sendMail({
      from: `"Shangrila 2k25" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // Admin email
      subject: "New Guest Registered",
      html: `
        <h3>A New Guest has Registered</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>WhatsApp:</strong> ${data.whatsapp}</p>
        <p><strong>Reference:</strong> ${data.reference}</p>
        <p><strong>Registeration Type:</strong> ${data.registerationType}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      registrationId,
      message: "Guest registered successfully!",
    });
  } catch (error) {
    console.error("Error saving guest:", error);
    return NextResponse.json({ success: false, message: "Failed to register guest." }, { status: 500 });
  }
}
