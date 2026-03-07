"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Member = {
  name: string;
  checkedIn: boolean;
};

export default function GateScannerPage() {

  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [registrationId, setRegistrationId] = useState("");
  const [scanning, setScanning] = useState(true);

  useEffect(() => {

    const scanner = new Html5Qrcode("reader");

    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      async (decodedText) => {
        handleScan(decodedText);
      },
      () => {}
    );

    return () => {
      scanner.stop().catch(()=>{});
    };

  }, []);

  const handleScan = async (decodedText:string) => {

    try {

      const url = new URL(decodedText);
      const regId = url.searchParams.get("regId");

      if (!regId) return;

      if (navigator.vibrate) {
  navigator.vibrate([200, 50, 200]);
}

      setScanning(false);

      const res = await fetch(`/api/verifyRegisteration?regId=${regId}`);
      const data = await res.json();

      if (!data.success) {
        toast.error("Invalid QR");
        resetScanner();
        return;
      }

      setRegistrationId(data.registrationId);
      setMembers(data.members);

    } catch {
      toast.error("Invalid QR");
      resetScanner();
    }

  };

  const resetScanner = () => {

    setMembers([]);
    setRegistrationId("");
    setScanning(true);

  };

  const handleCheckIn = async (index:number) => {

    const res = await fetch("/api/checkin",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        regId:registrationId,
        memberIndex:index
      })
    });

    const result = await res.json();

    if(!result.success){
      toast.error(result.message);
      return;
    }

    toast.success("Checked in");

    const updated = [...members];
    updated[index].checkedIn = true;

    setMembers(updated);

    // check if all members checked in
    const allChecked = updated.every(m => m.checkedIn);

    if(allChecked){
  toast.success("All guests checked in");
  setTimeout(()=>{
    resetScanner();
  },1500);
}

  };

  return (

    <div className="p-6 flex flex-col items-center gap-6 mt-24">

      {scanning && (
        <Card className="p-4 w-full max-w-md">
          <div id="reader"/>
        </Card>
      )}

      {!scanning && (

        <Card className="p-6 w-full max-w-md space-y-4">

  <h2 className="font-bold text-lg">
    Registration: {registrationId}
  </h2>

  {members.map((member,index)=>(
    
    <div
      key={index}
      className="flex justify-between items-center border p-3 rounded"
    >

      <div>
        <p className="font-semibold">{member.name}</p>
        <p className="text-sm">
          {member.checkedIn ? "Checked In" : "Not Checked In"}
        </p>
      </div>

      {!member.checkedIn && (
        <Button
          size="sm"
          onClick={()=>handleCheckIn(index)}
        >
          Check In
        </Button>
      )}

    </div>

  ))}

  {/* Scan Next Button */}

  <Button
    className="w-full mt-4"
    onClick={resetScanner}
  >
    Scan Next Guest
  </Button>

</Card>

      )}

    </div>

  );

}