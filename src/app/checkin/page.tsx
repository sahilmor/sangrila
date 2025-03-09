"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CheckInContent = () => {
  const searchParams = useSearchParams();
  const regId = searchParams.get("regId");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    success: boolean;
    message: string;
    type?: "guest" | "school";
    data?: {
      name: string;
      email: string;
      whatsapp: string;
      additionalMembers: number;
      checkedIn: boolean;
    };
  } | null>(null);

  useEffect(() => {
    if (!regId) return;

    const verifyRegistration = async () => {
      try {
        const response = await fetch(`/api/verifyRegisteration?regId=${regId}`);
        const result = await response.json();
        setUserData(result);
      } catch {
        setUserData({ success: false, message: "Error verifying registration" });
      } finally {
        setLoading(false);
      }
    };

    verifyRegistration();
  }, [regId]);

  const handleCheckIn = async () => {
    if (!regId) return;
    try {
      const response = await fetch(`/api/checkin`, {
        method: "POST",
        body: JSON.stringify({ regId }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        setUserData((prev) => prev && {
          ...prev,
          guest: {
            ...prev.data!,
            checkedIn: true,
          },
        });
      } else {
        console.error("Check-in failed", result.message);
      }
    } catch (error) {
      console.error("Check-in error:", error);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle>Event Check-In</CardTitle>
        <CardDescription>We warmly welcome you to the event</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Checking registration...</p>
        ) : userData?.success && userData.data ? (
          <div className="space-y-3">
            <p><strong>Name:</strong> {userData.data.name}</p>
            <p><strong>Email:</strong> {userData.data.email}</p>
            <p><strong>Phone:</strong> {userData.data.whatsapp}</p>
            <p><strong>Additional Members:</strong> {userData.data.additionalMembers}</p>
            <p className={userData.data.checkedIn ? "text-green-600" : "text-red-600"}>
              <strong>Status:</strong> {userData.data.checkedIn ? "Checked In" : "Not Checked In"}
            </p>
            {!userData.data.checkedIn && (
              <Button className="w-full" onClick={handleCheckIn}>
                Check In
              </Button>
            )}
          </div>
        ) : (
          <p className="text-red-500">{userData?.message || "User not found"}</p>
        )}
      </CardContent>
    </Card>
  );
};

const CheckInPage = () => {
  return (
    <div className="p-6 flex justify-center items-center h-[90dvh]">
      <Suspense fallback={<p>Loading...</p>}>
        <CheckInContent />
      </Suspense>
    </div>
  );
};

export default CheckInPage;
