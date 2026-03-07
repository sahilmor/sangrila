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

    const {
      members,
      coupon,
      discountPercentage,
      totalMembers,
      totalAmount,
      utrNumber,
    } = data;

    const primaryMember = members[0];

    const registrationId = uuidv4();

    const qrCodeURL = await QRCode.toDataURL(
      `https://sangrila.geetauniversity.edu.in/checkin?regId=${registrationId}`
    );

    console.log("Generated QR:", qrCodeURL.substring(0,50));
    console.log("Saving guest with QR:", qrCodeURL.length);

    const newGuest = new GuestDetails({
      registrationId,
      registrationType: "guest",

      members,
      totalMembers,
      totalAmount,

      appliedCoupon: coupon,
      discountPercentage,

      utrNumber,

      qrCode: qrCodeURL,

      paymentStatus: "pending",
      qrSent: false,
    });

    await newGuest.save();

    // EMAIL CONFIG
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // EMAIL TO USER
    await transporter.sendMail({
      from: `"Sangrila 2k26" <${process.env.EMAIL_USER}>`,
      to: primaryMember.email,
      subject: "Sangrila 2k26 Registration Confirmation",
      html: `
        <h2>Welcome, ${primaryMember.name}!</h2>
        <p>Your registration for Sangrila 2k26 is successful.</p>

        <p><strong>Registration ID:</strong> ${registrationId}</p>

        <p>Total Members: ${totalMembers}</p>
        <p>Total Amount Paid: ₹${totalAmount}</p>

        <p>After verifying your payment, your check-in ticket will be sent to your email.</p>

        <p>Regards,<br/>Geeta University</p>
      `,
    });

    // EMAIL TO ADMIN
    await transporter.sendMail({
      from: `"Sangrila 2k26" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Guest Registered",
      html: `
        <h3>New Registration</h3>

        <p><strong>Name:</strong> ${primaryMember.name}</p>
        <p><strong>Email:</strong> ${primaryMember.email}</p>
        <p><strong>Members:</strong> ${totalMembers}</p>
        <p><strong>Total Paid:</strong> ₹${totalAmount}</p>
        <p><strong>UTR:</strong> ${utrNumber}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      registrationId,
      message: "Guest registered successfully",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to register guest.",
      },
      { status: 500 }
    );
  }
}