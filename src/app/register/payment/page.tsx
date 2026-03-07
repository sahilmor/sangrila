"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [qrCode, setQrCode] = useState("");
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);

  const UPI_ID = "geetauniversity.62417837@hdfcbank";
  const PAYEE_NAME = "Sangrila 2k26";

  useEffect(() => {
    const data = sessionStorage.getItem("registrationData");

    if (!data) {
      router.push("/register/guest");
      return;
    }

    const parsed = JSON.parse(data);

    setMembers(parsed.members || []);
    setCoupon(parsed.coupon || "");
    setDiscountPercentage(parsed.discountPercentage || 0);
  }, []);

  const totalMembers = members.length;
  const baseAmount = totalMembers * 1000;
  const discount = (baseAmount * discountPercentage) / 100;
  const finalAmount = baseAmount - discount;

  useEffect(() => {
    const generateQR = async () => {
      const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
        PAYEE_NAME
      )}&am=${finalAmount}&cu=INR`;

      const qr = await QRCode.toDataURL(upiLink);
      setQrCode(qr);
    };

    if (finalAmount > 0) generateQR();
  }, [finalAmount]);

  const submitRegistration = async () => {
    if (!utr) {
      toast.error("Please enter UTR number");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          members,
          coupon,
          discountPercentage,
          totalMembers,
          totalAmount: finalAmount,
          utrNumber: utr,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error();

      toast.success("Registration successful");

      sessionStorage.removeItem("registrationData");

      router.push(`/register/success?registrationId=${result.registrationId}`);
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 p-6">
      <Card className="max-w-xl w-full shadow-xl rounded-xl">

        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-600 text-white text-center">
          <CardTitle className="text-2xl font-bold">
            Payment
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-8">

          <div className="bg-blue-50 p-4 rounded-lg space-y-1">
            <p>Total Members: {totalMembers}</p>
            <p>Price per member: ₹1000</p>
            <p>Subtotal: ₹{baseAmount}</p>

            {discountPercentage > 0 && (
              <p className="text-green-600">
                Coupon Discount: {discountPercentage}%
              </p>
            )}

            <p className="font-bold text-xl">
              Final Amount: ₹{finalAmount}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Label className="mb-2">Scan QR to Pay</Label>

            {qrCode && (
              <img
                src={qrCode}
                className="w-64 h-64 border rounded-lg"
              />
            )}

            <p className="text-sm mt-2 text-gray-500">
              UPI ID: {UPI_ID}
            </p>
          </div>

          <div>
            <Label>Enter UTR Number</Label>
            <Input
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="Transaction ID"
            />
          </div>

        </CardContent>

        <CardFooter className="flex justify-center p-6">
          <Button
            onClick={submitRegistration}
            className="w-full md:w-1/2 bg-orange-500 hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm Registration"}
          </Button>
        </CardFooter>

      </Card>
    </div>
  );
}