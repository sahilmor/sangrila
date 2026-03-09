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
<div style="background:#f3f4f6;padding:40px 10px;font-family:Arial,Helvetica,sans-serif">

<table align="center" width="600" cellpadding="0" cellspacing="0"
style="background:white;border-radius:10px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.08)">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#2563eb,#1e40af);color:white;padding:30px;text-align:center">

<h1 style="margin:0;font-size:28px">Sangrila 2K26</h1>
<p style="margin:6px 0 0 0;font-size:14px">Geeta University</p>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:30px;color:#374151">

<h2 style="margin-top:0">Registration Successful 🎉</h2>

<p>Hello <strong>${primaryMember.name}</strong>,</p>

<p>
Your registration for <strong>Sangrila 2K26</strong> has been successfully received.
</p>

<p>
Our team will now verify your payment details. Once the payment is verified,
your <strong>QR entry pass</strong> will be sent to your email.
</p>

<!-- REGISTRATION BOX -->

<table width="100%" style="margin-top:25px;background:#f9fafb;border-radius:8px;padding:20px">

<tr>
<td style="padding:8px 0"><strong>Registration ID</strong></td>
<td>${registrationId}</td>
</tr>

<tr>
<td style="padding:8px 0"><strong>Total Members</strong></td>
<td>${totalMembers}</td>
</tr>

<tr>
<td style="padding:8px 0"><strong>Total Amount</strong></td>
<td>₹${totalAmount}</td>
</tr>

<tr>
<td style="padding:8px 0"><strong>Payment Status</strong></td>
<td>Pending Verification</td>
</tr>

</table>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb">

<!-- EVENT DETAILS -->

<h3>Event Details</h3>

<table width="100%" style="font-size:14px">

<tr>
<td style="padding:6px 0"><strong>Event</strong></td>
<td>Sangrila 2K26</td>
</tr>

<tr>
<td style="padding:6px 0"><strong>Date</strong></td>
<td>14 March 2026</td>
</tr>

<tr>
<td style="padding:6px 0"><strong>Venue</strong></td>
<td>Geeta University</td>
</tr>

</table>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb">

<!-- IMPORTANT NOTES -->

<h3>Important Notes</h3>

<ul style="line-height:1.6;font-size:14px;color:#4b5563">

<li>Your QR entry ticket will be emailed after payment verification.</li>
<li>Please carry a valid government-issued photo ID.</li>
<li>The QR code will be scanned at the entry gate.</li>
<li>Entry passes are non-transferable.</li>

</ul>

<hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb">

<p style="margin-bottom:4px">If you have any questions, feel free to contact us.</p>

<p style="margin:4px 0;font-size:14px">📞 9211067540</p>
<p style="margin:4px 0;font-size:14px">📞 8168906211</p>

<p style="margin-top:25px">
Regards,<br>
<strong>Team DSW</strong><br>
Geeta University
</p>

</td>
</tr>

<!-- FOOTER -->

<tr>
<td style="background:#111827;color:#9ca3af;text-align:center;padding:14px;font-size:12px">

© 2026 Geeta University — Sangrila 2K26

</td>
</tr>

</table>

</div>
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