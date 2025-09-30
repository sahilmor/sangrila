"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Home,
  Phone,
  Ticket,
  Hash,
  QrCode,
  UserPlus,
  Contact,
} from "lucide-react";

export default function GuestRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apply, setApply] = useState(false);
  const [couponStatus, setCouponStatus] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(1000);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    whatsapp: "",
    appliedCoupon: "",
    utrNumber: "",
    registrationType: "guest",
    referredBy: "",
    referenceContact: "",
  });

  useEffect(() => {
    const baseAmount = 1000;
    const discountValue = (baseAmount * discountPercentage) / 100;
    setDiscountAmount(discountValue);
    setTotalAmount(Math.max(0, baseAmount - discountValue));
  }, [discountPercentage]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateCoupon = async () => {
    if (!formData.appliedCoupon) {
      setCouponStatus("Please enter a coupon code.");
      return;
    }
    setApply(true);

    try {
      const response = await fetch(`/api/coupons/code/${formData.appliedCoupon}`);
      const result = await response.json();

      if (!response.ok || !result || result.quantity <= 0) {
        setCouponStatus("Invalid or expired coupon.");
        setDiscountPercentage(0);
        return;
      }

      await fetch(`/api/coupons/code/${formData.appliedCoupon}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      setDiscountPercentage(result.discount);
      setCouponStatus(`Coupon applied! ${result.discount}% off`);
    } catch {
      setCouponStatus("Error validating coupon.");
    } finally {
      setApply(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.email.includes("@")) {
      toast.error("Invalid email address.");
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.whatsapp)) {
      toast.error("Invalid WhatsApp number.");
      return;
    }
    if (!formData.utrNumber) {
      toast.error("UTR number is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, totalAmount }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error();

      toast.success("Registration Successful!");
      router.push(`/register/success?registrationId=${result.registrationId}`);
    } catch {
      toast.error("Registration Failed!");
      router.push("/register/failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden border border-orange-200">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-600 p-8 text-center text-white">
          <CardTitle className="text-4xl font-extrabold drop-shadow-lg">
            Agaaz 2k25
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Guest Registration
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left */}
          <div className="space-y-5">
            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <User size={18} /> Name
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your full name"
                className="mt-2 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <Mail size={18} /> Email
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="example@email.com"
                className="mt-2 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <Home size={18} /> Address
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Your address"
                className="mt-2 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <Phone size={18} /> WhatsApp
              </Label>
              <Input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="10-digit number"
                className="mt-2 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <UserPlus size={18} /> Referred By
              </Label>
              <Input
                value={formData.referredBy}
                onChange={(e) => handleChange("referredBy", e.target.value)}
                placeholder="Referrer name"
                className="mt-2 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <Contact size={18} /> Reference Contact
              </Label>
              <Input
                value={formData.referenceContact}
                onChange={(e) => handleChange("referenceContact", e.target.value)}
                placeholder="Referrer contact number"
                className="mt-2 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-5">
            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <Ticket size={18} /> Total Payment
              </Label>
              <Input
                type="number"
                value={totalAmount}
                readOnly
                className="mt-2 font-bold bg-blue-50 text-blue-700"
              />
              {discountAmount > 0 && (
                <p className="text-green-600 text-sm mt-1">
                  Discount: ₹{discountAmount}
                </p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <Ticket size={18} /> Coupon Code
              </Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  value={formData.appliedCoupon}
                  onChange={(e) => handleChange("appliedCoupon", e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-1 focus:border-orange-400 focus:ring-orange-400"
                />
                <Button
                  type="button"
                  onClick={validateCoupon}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {apply ? "Applying..." : "Apply"}
                </Button>
              </div>
              {couponStatus && (
                <p
                  className={`mt-2 text-sm ${
                    discountAmount ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {couponStatus}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center">
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <QrCode size={18} /> Scan to Pay
              </Label>
              <Image
                src="/paymentQr.jpg"
                alt="QR Code"
                className="mt-2 rounded-lg border shadow"
                width={220}
                height={220}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 text-blue-700 font-medium">
                <Hash size={18} /> UTR No.
              </Label>
              <Input
                value={formData.utrNumber}
                onChange={(e) => handleChange("utrNumber", e.target.value)}
                placeholder="Transaction ID"
                className="mt-2 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col items-center gap-6 p-8 bg-blue-50">
          <Button
            onClick={handleSubmit}
            className="w-full md:w-1/2 py-4 text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <div className="w-full bg-orange-50 border border-orange-200 rounded-lg p-5 max-h-56 overflow-y-auto">
            <h2 className="font-bold text-lg mb-3 text-center text-blue-800">
              Guidelines for Entry Pass
            </h2>
            <ul className="list-decimal pl-5 space-y-1 text-gray-700 text-sm">
              <li>This Entry pass is valid only for 1 person.</li>
              <li>No entry before/after the stipulated time shall be permitted.</li>
              <li>Entry Passes are non-transferrable.</li>
              <li>Organizer reserves the right of admission even to valid Pass holders.</li>
              <li>
                Consumption/Carrying of illegal substances/Alcohol/Smoking is strictly
                prohibited.
              </li>
              <li>No re-entry is allowed due to safety and security concerns.</li>
              <li>
                Pass holders must carry a valid original government photo ID proof (Aadhaar, etc.).
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              For security reasons, the organizer reserves the right to perform checks on any
              member/vehicle of the audience at any point during the event.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
