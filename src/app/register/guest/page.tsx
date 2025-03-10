"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const referenceOptions = [
  "Pro Chancellor",
  "Vice Chancellor",
  "Pro Vice Chancellor",
  "Engineering Head",
  "Forensic Head",
  "Other Department Heads",
];

export default function GuestRegisteration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    adress: "",
    whatsapp: "",
    additionalMembers: "",
    reference: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
          adress: "",
          whatsapp: "",
          additionalMembers: "",
          reference: "",
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
    <div className="flex justify-center items-center h-[120dvh] bg-gray-100 p-6 md:mt-0 mt-8">
      <Card className="shadow-lg">
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
            <Input value={formData.adress} onChange={(e) => handleChange("adress", e.target.value)} placeholder="Enter your address" className="mt-2" />
          </div>

          <div>
            <Label>WhatsApp Number</Label>
            <Input type="tel" value={formData.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} placeholder="Enter your WhatsApp number" className="mt-2" />
          </div>

          <div>
            <Label>Number of Additional Members</Label>
            <Input type="number" value={formData.additionalMembers} onChange={(e) => handleChange("additionalMembers", e.target.value)} placeholder="Enter number of accompanying members" min="0" className="mt-2" />
          </div>

          <div>
            <Label>Reference</Label>
            <Select onValueChange={(value) => handleChange("reference", value)}>
              <SelectTrigger className="mt-2 w-full">
                <SelectValue placeholder="Select a reference" />
              </SelectTrigger>
              <SelectContent>
                {referenceOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
