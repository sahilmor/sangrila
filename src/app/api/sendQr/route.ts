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
            from: `"Sangrila 2k25" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your Sangrila 2k25 Check-in QR Code",
            html: `
                <h2>Hello!</h2>
                <p>Here is your check-in QR code for Sangrila 2k25.</p>
                <p>Please find the attached QR code image.</p>
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
