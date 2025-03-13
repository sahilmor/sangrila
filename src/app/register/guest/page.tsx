"use client";

import { useEffect, useState } from "react";
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
  const [couponStatus, setCouponStatus] = useState(""); // For success/error messages
  const [discountPercentage, setDiscountPercentage] = useState(0); // Store discount percentage
  const [discountAmount, setDiscountAmount] = useState(0); // Store calculated discount
  const [totalAmount, setTotalAmount] = useState(1000);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    whatsapp: "",
    additionalMembers: "0",
    totalAmount: "1000",
    appliedCoupon: "",
    utrNumber: "",
    registrationType: "guest",
  });

  useEffect(() => {
    const additionalMembers = Number(formData.additionalMembers) || 0;
    const baseAmount = (additionalMembers + 1) * 1000; // ₹1000 per person

    // Calculate discount amount
    const discountValue = (baseAmount * discountPercentage) / 100;
    setDiscountAmount(discountValue);

    // Update totalAmount with discount applied
    setTotalAmount(Math.max(0, baseAmount - discountValue)); // Ensure no negative values
  }, [formData.additionalMembers, discountPercentage]);


  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCoupon = async () => {
    if (!formData.appliedCoupon) {
      setCouponStatus("Please enter a coupon code.");
      return;
    }
  
    try {
      // Fetch coupon details
      const response = await fetch(`/api/coupons/code/${formData.appliedCoupon}`);
      const result = await response.json();
  
      if (!response.ok || !result || result.quantity <= 0) {
        setCouponStatus("Invalid, expired, or out-of-stock coupon.");
        setDiscountPercentage(0);
        return;
      }
  
      // Apply coupon and update quantity in database
      const updateResponse = await fetch(`/api/coupons/code/${formData.appliedCoupon}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
  
      const updateResult = await updateResponse.json();
  
      if (!updateResponse.ok || !updateResult.success) {
        setCouponStatus(updateResult.error || "Failed to apply coupon.");
        return;
      }
  
      setDiscountPercentage(result.discount);
      setCouponStatus(`Coupon applied! ${result.discount}% off`);
    } catch (error) {
      console.error("Coupon validation error:", error);
      setCouponStatus("Error validating coupon. Try again.");
    }
  };
  
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, totalAmount }), // Send the calculated total amount
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
          utrNumber: "",
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
            <Input type="number" value={totalAmount} readOnly className="mt-2 bg-gray-100 cursor-not-allowed" />
            {discountAmount > 0 && <p className="text-green-600 text-sm mt-1">Discount Applied: ₹{discountAmount}</p>}
          </div>

          {/* Coupon Code Field */}
          <div>
            <Label>Coupon Code</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                value={formData.appliedCoupon}
                onChange={(e) => handleChange("appliedCoupon", e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1"
              />
              <Button type="button" onClick={validateCoupon} className="w-auto">
                Apply
              </Button>
            </div>
            {couponStatus && (
              <p className={`mt-2 text-sm ${discountAmount ? "text-green-600" : "text-red-600"}`}>
                {couponStatus}
              </p>
            )}
          </div>


          <div className="flex flex-col items-center">
            <Label>Scan to Pay</Label>
            <Image src="/paymentQr.jpg" alt="QR Code" className="mt-2" width={300} height={300} />
          </div>

          {/* UTR No. Field */}
          <div className="mt-2">
            <Label>UTR No.</Label>
            <Input value={formData.utrNumber} onChange={(e) => handleChange("utrNumber", e.target.value)} placeholder="Enter UTR number (Transaction ID)" className="mt-2" />
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
