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
  const [scanLock, setScanLock] = useState(false);

  const startScanner = async () => {

  try {

    scannerRef.current = new Html5Qrcode("reader");

    await scannerRef.current.start(
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

  } catch (err) {
    console.error("Scanner start error:", err);
  }

};

  useEffect(() => {

  startScanner();

  return () => {
    scannerRef.current?.stop().catch(()=>{});
  };

}, []);

  const handleScan = async (decodedText:string) => {

    if (scanLock) return; // prevent multiple triggers

  setScanLock(true);
    try {

      const url = new URL(decodedText);
      const regId = url.searchParams.get("regId");

      if (!regId) return;

      if (navigator.vibrate) {
  navigator.vibrate(200);
}

await scannerRef.current?.stop();
await scannerRef.current?.clear();

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

const resetScanner = async () => {

  try {

    if (scannerRef.current) {

      await scannerRef.current.stop().catch(()=>{});
  scannerRef.current?.clear();

      scannerRef.current = null;

    }

  } catch {}

  setMembers([]);
  setRegistrationId("");
  setScanning(true);
  setScanLock(false);

  setTimeout(() => {
    startScanner();
  }, 200);

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

      <Card className={scanning ? "block" : "hidden"}>
  <div id="reader"/>
</Card>

      {!scanning && (

        <Card className="p-6 w-full max-w-md space-y-4">

  <h2 className="font-bold text-lg">
    Registration: {registrationId}
  </h2>
  <p>Total Members: {members.length}</p>
  <p>Checked In: {members.filter(m => m.checkedIn).length}</p>
  <p>Remaining: {members.length - members.filter(m => m.checkedIn).length}</p>


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