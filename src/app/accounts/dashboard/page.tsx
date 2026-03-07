'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";

interface Member {
  name: string;
  email: string;
  whatsapp?: string;
}

interface Registration {
  registrationId: string;
  members: Member[];
  totalMembers: number;
  paymentStatus: string;
  utrNumber: string;
  totalAmount: number;
  discountPercentage: number;
  appliedCoupon: string;
}

export default function AccountsDashboard() {

  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<{ [key: string]: boolean }>({});

  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalVerified: 0,
    totalPending: 0,
    totalFailed: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/registerations");
      const data = await res.json();

      setRegistrations(data);

      const totalRegistrations = data.length;
      const totalVerified = data.filter((r: Registration) => r.paymentStatus === "verified").length;
      const totalPending = data.filter((r: Registration) => r.paymentStatus === "pending").length;
      const totalFailed = data.filter((r: Registration) => r.paymentStatus === "failed").length;

      setStats({
        totalRegistrations,
        totalVerified,
        totalPending,
        totalFailed,
      });

    } catch {
      toast.error("Failed to fetch registrations");
    }

    setIsLoading(false);
  };

  const updatePaymentStatus = async (registrationId: string, status: "verified" | "failed") => {

    setLoadingStatus(prev => ({ ...prev, [registrationId]: true }));

    try {

      const res = await fetch("/api/confirmPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ registrationId, status })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(`Payment ${status}`);

      fetchData();

    } catch {
      toast.error("Failed to update payment status");
    }

    setLoadingStatus(prev => ({ ...prev, [registrationId]: false }));
  };

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto">

      {/* Header */}

      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage registrations & payments</p>
        </div>

        <Button onClick={() => signOut({ callbackUrl: "/login" })}>
          Logout
        </Button>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <Card>
          <CardHeader>
            <CardTitle>Total Registrations</CardTitle>
            <CardDescription>All users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verified</CardTitle>
            <CardDescription>Payments confirmed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.totalVerified}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
            <CardDescription>Awaiting verification</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalPending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed</CardTitle>
            <CardDescription>Rejected payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{stats.totalFailed}</p>
          </CardContent>
        </Card>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl p-8 shadow">

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto mb-4" />
            Loading registrations...
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            No registrations found
          </div>
        ) : (

          <div className="border rounded-lg overflow-auto">

            <Table>

              <TableHeader>

                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>UTR</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Coupon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>

              </TableHeader>

              <TableBody>

                {registrations.map(reg => {

                  const primary = reg.members[0];

                  return (

                    <TableRow key={reg.registrationId}>

                      <TableCell>{primary?.name}</TableCell>

                      <TableCell>{primary?.email}</TableCell>

                      <TableCell>{reg.totalMembers}</TableCell>

                      <TableCell>{reg.utrNumber || "N/A"}</TableCell>

                      <TableCell>₹{reg.totalAmount}</TableCell>

                      <TableCell>
                        {reg.appliedCoupon || "-"}
                      </TableCell>

                      <TableCell>

                        {reg.paymentStatus === "verified" && (
                          <Badge className="bg-green-100 text-green-600">
                            Verified
                          </Badge>
                        )}

                        {reg.paymentStatus === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-600">
                            Pending
                          </Badge>
                        )}

                        {reg.paymentStatus === "failed" && (
                          <Badge className="bg-red-100 text-red-600">
                            Failed
                          </Badge>
                        )}

                      </TableCell>

                      <TableCell className="flex gap-2">

                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            updatePaymentStatus(reg.registrationId, "verified")
                          }
                          disabled={
                            reg.paymentStatus !== "pending" ||
                            loadingStatus[reg.registrationId]
                          }
                        >

                          {loadingStatus[reg.registrationId]
                            ? <Loader2 className="animate-spin" size={14} />
                            : <Check size={14} />
                          }

                        </Button>

                        <Button
                          size="sm"
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() =>
                            updatePaymentStatus(reg.registrationId, "failed")
                          }
                          disabled={
                            reg.paymentStatus !== "pending" ||
                            loadingStatus[reg.registrationId]
                          }
                        >

                          {loadingStatus[reg.registrationId]
                            ? <Loader2 className="animate-spin" size={14} />
                            : <X size={14} />
                          }

                        </Button>

                      </TableCell>

                    </TableRow>

                  );
                })}

              </TableBody>

            </Table>

          </div>
        )}

      </div>

    </div>
  );
}