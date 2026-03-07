"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Member = {
  name: string;
  email: string;
  whatsapp?: string;
  checkedIn: boolean;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  registrationId?: string;
  totalMembers?: number;
  checkedIn?: number;
  remaining?: number;
  members?: Member[];
};

const CheckInContent = () => {

  const searchParams = useSearchParams();
  const regId = searchParams.get("regId");

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState<number | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {

    if (!regId) return;

    const loadData = async () => {

      try {

        const res = await fetch(`/api/verifyRegisteration?regId=${regId}`);
        const result = await res.json();

        setData(result);

      } catch {

        toast.error("Error verifying registration");

      } finally {

        setLoading(false);

      }

    };

    loadData();

  }, [regId]);

  const handleCheckIn = async (memberIndex: number) => {

    if (!regId) return;

    setChecking(memberIndex);

    try {

      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          regId,
          memberIndex
        })
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Member checked in");

      // Update UI locally
      setData(prev => {

        if (!prev || !prev.members) return prev;

        const updatedMembers = [...prev.members];

        updatedMembers[memberIndex].checkedIn = true;

        const checked = updatedMembers.filter(m => m.checkedIn).length;

        return {
          ...prev,
          members: updatedMembers,
          checkedIn: checked,
          remaining: updatedMembers.length - checked
        };

      });

    } catch (err) {

      toast.error("Check-in failed");

    } finally {

      setChecking(null);

    }

  };

  return (

    <Card className="w-full max-w-lg shadow-lg">

      <CardHeader>

        <CardTitle>Event Check-In</CardTitle>

        <CardDescription>
          Scan verified ticket
        </CardDescription>

      </CardHeader>

      <CardContent>

        {loading ? (

          <p>Loading registration...</p>

        ) : !data?.success ? (

          <p className="text-red-500">
            {data?.message || "Invalid ticket"}
          </p>

        ) : (

          <div className="space-y-4">

            <div className="border p-3 rounded">

              <p><strong>Registration ID:</strong> {data.registrationId}</p>
              <p><strong>Total Members:</strong> {data.totalMembers}</p>
              <p><strong>Checked In:</strong> {data.checkedIn}</p>
              <p><strong>Remaining:</strong> {data.remaining}</p>

            </div>

            <div className="space-y-3">

              {data.members?.map((member, index) => (

                <div
                  key={index}
                  className="border rounded p-3 flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      {member.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {member.checkedIn ? "Checked In" : "Not Checked In"}
                    </p>

                  </div>

                  {!member.checkedIn && (

                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(index)}
                      disabled={checking === index}
                    >
                      {checking === index ? "Checking..." : "Check In"}
                    </Button>

                  )}

                </div>

              ))}

            </div>

          </div>

        )}

      </CardContent>

    </Card>

  );

};

const CheckInPage = () => {

  return (

    <div className="p-6 flex justify-center items-center min-h-[90vh]">

      <Suspense fallback={<p>Loading...</p>}>

        <CheckInContent />

      </Suspense>

    </div>

  );

};

export default CheckInPage;