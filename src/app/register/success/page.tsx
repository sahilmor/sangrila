"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Loading from "@/components/layout/Loading";
import { Suspense } from "react";

const SuccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("registrationId");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center md:max-w-lg w-full mt-18 md:mt-0">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for registering for <strong>Agaaz 2k25</strong>.
        </p>
        <p className="text-gray-600 mt-2">
          Your registration ID is <strong>{registrationId}</strong>
        </p>

        {/* Payment Verification Notice */}
        <div className="bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg mt-6">
          <p>We have received your registration details.</p>
          <p>
            After verifying your payment, your check-in ticket will be
            delivered to your email.
          </p>
        </div>

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