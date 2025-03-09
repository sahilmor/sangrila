import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fetchUserData = async (regId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verifyregisteration?regId=${regId}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    return null;
  }
};

const CheckInPage = async ({ searchParams }: { searchParams: { regId?: string } }) => {
  const regId = searchParams?.regId;

  if (!regId) return notFound();

  const userData = await fetchUserData(regId);

  if (!userData?.success) {
    return (
      <div className="p-6 flex justify-center items-center h-[90dvh]">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Event Check-In</CardTitle>
            <CardDescription>We warm welcome you to the event</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{userData?.message || "User not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { name, email, whatsapp, additionalMembers, checkedIn } = userData.guest;

  return (
    <div className="p-6 flex justify-center items-center h-[90dvh]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Event Check-In</CardTitle>
          <CardDescription>We warm welcome you to the event</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {whatsapp}</p>
            <p><strong>Additional Members:</strong> {additionalMembers}</p>
            <p className={checkedIn ? "text-green-600" : "text-red-600"}>
              <strong>Status:</strong> {checkedIn ? "Checked In" : "Not Checked In"}
            </p>
            {!checkedIn && (
              <form action={`/api/checkin`} method="POST">
                <input type="hidden" name="regId" value={regId} />
                <Button className="w-full" type="submit">Check In</Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInPage;
