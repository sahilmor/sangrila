"use client";
import React, { useEffect, useState, Suspense } from "react";
import QRCode from "qrcode";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Loading from "@/components/layout/Loading";
import { toast } from "sonner";

const SuccessPageContent = () => {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId");

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = `https://sangrila2k25.vercel.app/checkin?regId=${registrationId}`;
        const qrImage = await QRCode.toDataURL(qrData);
        setQrCode(qrImage);
      } catch {
        toast.error("Failed! Please try again.");
      }
    };

    if (registrationId) {
      generateQRCode();
    }
  }, [registrationId]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center md:max-w-lg w-full mt-18 md:mt-0">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for registering for <strong>Sangrila 2k25</strong>.
        </p>
        <p className="text-gray-600 mt-2">
          Your registration ID is <strong>{registrationId}</strong>
        </p>

        {/* New Section: Payment Verification Notice */}
        <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mt-6">
          <p>We have received your registration details.</p>
          <p>
            After verifying your payment, your check-in ticket will be
            delivered to your email.
          </p>
        </div>

        {/* QR Code Section */}
        {qrCode && (
          <div className="mt-6">
            <p className="text-gray-600">Scan this QR code to check in:</p>
            <Image src={qrCode} alt="QR Code" className="w-40 h-40 mx-auto mt-2" width={160} height={160} />
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/")} className="cursor-pointer">
            ← Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

const SuccessPage = () => (
  <Suspense fallback={<div><Loading /></div>}>
    <SuccessPageContent />
  </Suspense>
);

export default SuccessPage;
