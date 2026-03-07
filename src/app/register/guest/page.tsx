"use client";

import { useState } from "react";
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
import {
  User,
  Mail,
  Home,
  Phone,
  UserPlus,
  Contact,
  Ticket,
  Trash2,
} from "lucide-react";

export default function GuestRegistration() {
  const router = useRouter();

  const [apply, setApply] = useState(false);
  const [couponStatus, setCouponStatus] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const [members, setMembers] = useState([
    {
      name: "",
      email: "",
      address: "",
      whatsapp: "",
      referredBy: "",
      referenceContact: "",
    },
  ]);

  const [coupon, setCoupon] = useState("");

  const updateMember = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([
      ...members,
      {
        name: "",
        email: "",
      } as any,
    ]);
  };

  const validateCoupon = async () => {
    if (!coupon) {
      setCouponStatus("Enter a coupon code");
      return;
    }

    setApply(true);

    try {
      const res = await fetch(`/api/coupons/code/${coupon}`);
      const result = await res.json();

      if (!res.ok || !result || result.quantity <= 0) {
        setCouponStatus("Invalid or expired coupon");
        setDiscountPercentage(0);
        return;
      }

      setDiscountPercentage(result.discount);
      setCouponStatus(`Coupon applied! ${result.discount}% off`);
    } catch {
      setCouponStatus("Error validating coupon");
    } finally {
      setApply(false);
    }
  };

  const proceedToPayment = () => {
  const primary = members[0];

  if (!primary.name || !primary.email || !primary.whatsapp) {
    toast.error("Please fill primary member details");
    return;
  }

  if (!/^[0-9]{10}$/.test(primary.whatsapp)) {
    toast.error("Invalid WhatsApp number");
    return;
  }

  const payload = {
    members,
    coupon,
    discountPercentage,
  };

  // store data
  sessionStorage.setItem(
    "registrationData",
    JSON.stringify(payload)
  );

  // redirect to payment page
  router.push("/register/payment");
};

  const removeMember = (index: number) => {
  const updated = members.filter((_, i) => i !== index);
  setMembers(updated);
};

  const totalMembers = members.length;
  const baseAmount = totalMembers * 1000;
  const discount = (baseAmount * discountPercentage) / 100;
  const finalAmount = baseAmount - discount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl rounded-2xl shadow-xl border border-orange-200">

        <CardHeader className="bg-gradient-to-r from-orange-500 to-blue-600 p-8 text-center text-white">
          <CardTitle className="text-4xl font-extrabold">
            Sangrila 2k26
          </CardTitle>
          <CardDescription className="text-orange-100 text-lg">
            Guest Registration
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-6">

          {/* Primary Member */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-blue-700">
              Primary Member
            </h2>

            <Input
              placeholder="Full Name"
              value={members[0].name}
              onChange={(e) =>
                updateMember(0, "name", e.target.value)
              }
            />

            <Input
              placeholder="Email"
              value={members[0].email}
              onChange={(e) =>
                updateMember(0, "email", e.target.value)
              }
            />

            <Input
              placeholder="Address"
              value={members[0].address}
              onChange={(e) =>
                updateMember(0, "address", e.target.value)
              }
            />

            <Input
              placeholder="Whatsapp Number"
              value={members[0].whatsapp}
              onChange={(e) =>
                updateMember(0, "whatsapp", e.target.value)
              }
            />

            <Input
              placeholder="Referred By"
              value={members[0].referredBy}
              onChange={(e) =>
                updateMember(0, "referredBy", e.target.value)
              }
            />

            <Input
              placeholder="Reference Contact"
              value={members[0].referenceContact}
              onChange={(e) =>
                updateMember(0, "referenceContact", e.target.value)
              }
            />
          </div>

          {/* Additional Members */}

          {members.slice(1).map((member, index) => {
  const actualIndex = index + 1;

  return (
    <div
      key={actualIndex}
      className="border rounded-lg p-4 space-y-3 relative"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Member {actualIndex + 1}
        </h3>

        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => removeMember(actualIndex)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <Input
        placeholder="Name"
        value={member.name}
        onChange={(e) =>
          updateMember(actualIndex, "name", e.target.value)
        }
      />

      <Input
        placeholder="Email"
        value={member.email}
        onChange={(e) =>
          updateMember(actualIndex, "email", e.target.value)
        }
      />
    </div>
  );
})}

          <Button
            type="button"
            onClick={addMember}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="mr-2" size={18} />
            Add Member
          </Button>

          {/* Coupon */}

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-blue-700 font-medium">
              <Ticket size={18} /> Coupon Code
            </Label>

            <div className="flex gap-2">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon"
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
              <p className="text-sm text-green-600">
                {couponStatus}
              </p>
            )}
          </div>

          {/* Price Summary */}

          <div className="bg-blue-50 rounded-lg p-4 space-y-1">
            <p>Total Members: {totalMembers}</p>
            <p>Price per member: ₹1000</p>
            <p>Subtotal: ₹{baseAmount}</p>

            {discountPercentage > 0 && (
              <p className="text-green-600">
                Discount: {discountPercentage}%
              </p>
            )}

            <p className="font-bold text-lg">
              Total Payable: ₹{finalAmount}
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-8 bg-blue-50 flex justify-center">
          <Button
            onClick={proceedToPayment}
            className="w-full md:w-1/2 py-4 text-lg font-bold bg-orange-500 hover:bg-orange-600"
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}