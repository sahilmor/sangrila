import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { email, qrCodeImage } = await req.json();

        if (!email || !qrCodeImage) {
            return NextResponse.json({ success: false, message: "Missing email or QR code image." }, { status: 400 });
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
            from: `"Agaaz 2k25" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Agaaz 2k25 Check-in QR Code",
            html: `
                <h2>Dear User,</h2>
                <p>Please find attached your check-in QR code for Agaaz 2K25. Kindly present this QR code to the officials at the entry gate of Geeta University.</p>
                <p><strong>Event Details:</strong></p>
                <p><strong>Date:</strong> 4th Oct 2025</p>
                <p><strong>Venue:</strong> Geeta University</p>
                
                <p>Looking forward to welcoming you!</p>
                <p><strong>Best regards,</strong></p>
                <p><strong>Geeta University</strong></p>

            `,
            attachments: [
                {
                    filename: `QR-${uuidv4()}.png`, // Unique filename
                    content: qrBuffer,
                    encoding: "base64",
                },
            ],
        });

        return NextResponse.json({ success: true, message: "QR code sent successfully!" });
    } catch (error) {
        console.error("Error sending QR email:", error);
        return NextResponse.json({ success: false, message: "Failed to send QR code email." }, { status: 500 });
    }
}
