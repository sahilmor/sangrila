import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, qrCodeImage, name, registrationId, totalMembers } =
      await req.json();

    if (!email || !qrCodeImage) {
      return NextResponse.json(
        { success: false, message: "Missing email or QR code image." },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Convert Base64 to Buffer
    const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, ""); // Remove prefix
    const qrBuffer = Buffer.from(base64Data, "base64");

    await transporter.sendMail({
      from: `"Sangrila 2k26" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Sangrila 2k26 Check-in QR Code",
      html: `
<div style="background:#0f172a;padding:30px 10px;font-family:Arial,Helvetica,sans-serif">

<table align="center" width="600" cellpadding="0" cellspacing="0" 
style="background:#111827;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.4)">

<!-- Gradient Header -->
<tr>
<td style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:30px;text-align:center;color:white">

<h1 style="margin:0;font-size:28px;letter-spacing:1px">
Sangrila 2K26
</h1>

<p style="margin:6px 0 0 0;font-size:14px">
Geeta University
</p>

</td>
</tr>

<!-- Ticket Card -->
<tr>
<td style="padding:30px;color:#e5e7eb">

<h2 style="margin-top:0;color:white">🎉 Registration Confirmed</h2>

<p>Hello <strong>${name}</strong>,</p>

<p>Your entry pass for <strong>Sangrila 2K26</strong> has been successfully verified.</p>


<!-- Ticket Box -->
<table width="100%" style="margin:25px 0;background:#1f2937;border-radius:10px;padding:20px">

<tr>

<td>

<p style="margin:0;font-size:12px;color:#9ca3af">Registration ID</p>
<h2 style="margin:6px 0;color:white">${registrationId}</h2>

<p style="margin:0;font-size:12px;color:#9ca3af">Members</p>
<p style="margin:4px 0;font-size:16px">${totalMembers} Guests</p>

</td>

<td align="right">

<img src="cid:qrcode" width="180" height="180" 
style="border-radius:6px;border:4px solid #111827"/>

</td>

</tr>

</table>

<p style="font-size:14px;color:#9ca3af">
Please present this QR code at the entry gate during the event.
</p>

<hr style="border:none;border-top:1px solid #374151;margin:30px 0">

<!-- Event Details -->

<h3 style="margin:0;color:white">Event Details</h3>

<table width="100%" style="margin-top:10px;font-size:14px;color:#d1d5db">

<tr>
<td style="padding:6px 0"><strong>Event</strong></td>
<td>Sangrila 2K26</td>
</tr>

<tr>
<td style="padding:6px 0"><strong>Date</strong></td>
<td>13 – 14 March 2026</td>
</tr>

<tr>
<td style="padding:6px 0"><strong>Venue</strong></td>
<td>Geeta University</td>
</tr>

</table>

<hr style="border:none;border-top:1px solid #374151;margin:30px 0">

<!-- Rules -->

<h3 style="color:white;margin-bottom:10px">Rules & Guidelines</h3>

<ul style="font-size:14px;color:#9ca3af;line-height:1.6;padding-left:18px">

<li>This QR code is strictly personal and confidential.</li>

<li>Do not share this QR code with anyone.</li>

<li>This ticket is valid only for <strong>${totalMembers}</strong> members.</li>

<li>Carry a valid government-issued ID.</li>

<li>Entry may be denied if QR code is misused.</li>

</ul>

<hr style="border:none;border-top:1px solid #374151;margin:30px 0">

<!-- Support -->

<h3 style="color:white;margin-bottom:8px">Need Help?</h3>

<p style="margin:4px 0;font-size:14px;color:#9ca3af">📞 9211067540</p>
<p style="margin:4px 0;font-size:14px;color:#9ca3af">📞 8168906211</p>

<div style="margin-top:20px">

<a href="https://sangrila2k26.netlify.app" 
style="display:inline-block;background:#2563eb;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;font-size:14px">
Visit Event Website
</a>

</div>

<p style="margin-top:25px">
Regards,<br>
<strong>Team DSW</strong><br>
Geeta University
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#1f2937;color:#9ca3af;text-align:center;padding:16px;font-size:12px">

© 2026 Geeta University | Sangrila 2K26

</td>
</tr>

</table>

</div>
`,
      attachments: [
{
filename: "ticket-qr.png",
content: qrBuffer,
cid: "qrcode"
}
],
    });

    return NextResponse.json({
      success: true,
      message: "QR code sent successfully!",
    });
  } catch (error) {
    console.error("Error sending QR email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send QR code email." },
      { status: 500 },
    );
  }
}
