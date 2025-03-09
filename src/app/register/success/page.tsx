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
        const qrData = `https://event.com/checkin?regId=${registrationId}`;
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

  const downloadQRCode = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `QR_${registrationId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center md:max-w-lg w-full mt-18 md:mt-0 ">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for registering for <strong>Sangrila 2k25</strong> as an Alumni. Your registration ID is {registrationId}
        </p>

        {/* QR Code Section */}
        {qrCode && (
          <div className="mt-6">
            <p className="text-gray-600">Scan this QR code to check in:</p>
            <Image src={qrCode} alt="QR Code" className="w-40 h-40 mx-auto mt-2" width={160} height={160} />
          </div>
        )}

        <p className="text-gray-500 text-sm mt-3">
          Save your QR Code for event entry.
        </p>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          <Button variant="outline" onClick={() => router.push("/")}>
            ← Return to Home
          </Button>
          <Button onClick={downloadQRCode}>Download QR Code</Button>
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
