"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function GuestRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    whatsapp: "",
    additionalMembers: "0",
    totalAmount: "1000",
    appliedCoupon: "",
    utrNo: "",
    registrationType: "guest",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value };

      if (field === "additionalMembers") {
        const additionalMembers = Number(value) || 0;
        updatedData.totalAmount = String((additionalMembers + 1) * 1000);
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error("Failed to register");

      if (result.success && result.registrationId) {
        toast.success("Registration Successful!");

        setFormData({
          name: "",
          email: "",
          address: "",
          whatsapp: "",
          additionalMembers: "0",
          totalAmount: "1000",
          appliedCoupon: "",
          utrNo: "",
          registrationType: "guest",
        });

        router.push(`/register/success?registrationId=${result.registrationId}`);
      } else {
        throw new Error("Registration failed");
      }
    } catch {
      toast.error("Registration Failed! Please try again.");
      router.push("/register/failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6">
      <Card className="shadow-lg mt-16">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sangrila 2k25</CardTitle>
          <CardDescription>Join us for the Sangrila 2k25. We are excited to have you with us.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Enter your name" className="mt-2" />
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Enter your email" className="mt-2" />
          </div>

          <div>
            <Label>Address</Label>
            <Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Enter your address" className="mt-2" />
          </div>

          <div>
            <Label>WhatsApp Number</Label>
            <Input type="tel" value={formData.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} placeholder="Enter your WhatsApp number" className="mt-2" />
          </div>

          <div>
            <Label>Number of Additional Members</Label>
            <Input type="number" value={formData.additionalMembers} onChange={(e) => handleChange("additionalMembers", e.target.value)} placeholder="Enter number of accompanying members" min="0" className="mt-2" />
          </div>

          {/* Total Payment Field */}
          <div>
            <Label>Total Payment</Label>
            <Input type="number" value={formData.totalAmount} readOnly className="mt-2 bg-gray-100 cursor-not-allowed" />
          </div>

          {/* Coupon Code Field */}
          <div>
            <Label>Coupon Code</Label>
            <Input value={formData.appliedCoupon} onChange={(e) => handleChange("appliedCoupon", e.target.value)} placeholder="Enter coupon code (if any)" className="mt-2" />
          </div>

          <div className="flex flex-col items-center">
            <Label>Scan to Pay</Label>
            <Image src="/qr-code.png" alt="QR Code" className="mt-2 w-40 h-40" width={100} height={100} />
          </div>

          {/* UTR No. Field */}
          <div>
            <Label>UTR No.</Label>
            <Input value={formData.utrNo} onChange={(e) => handleChange("utrNo", e.target.value)} placeholder="Enter UTR number (Transaction ID)" className="mt-2" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
