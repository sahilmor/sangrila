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
import { Download, FileText, LogOut, Menu, Send, Ticket } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Member {
  name: string;
  email: string;
  whatsapp?: string;
  address?: string;
}

interface Registration {
  registrationId: string;
  members: Member[];
  totalMembers: number;
  paymentStatus: string;
  qrCode: string;
  qrSent: boolean;
  totalAmount: number;
  utrNumber?: string;
  appliedCoupon?: string;
  discountPercentage?: number;
  createdAt: string;
}

export default function AdminDashboard() {

  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [sendingQr, setSendingQr] = useState<{ [key: string]: boolean }>({});

  const [stats, setStats] = useState({
    totalRegistrations: 0
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

      setStats({
        totalRegistrations: data.length
      });

    } catch {
      toast.error("Failed to load registrations");
    }

    setIsLoading(false);
  };

  const exportUserDetailsToExcel = () => {

    const headers = [
      "Registration ID",
      "Primary Name",
      "Primary Email",
      "Phone",
      "Total Members",
      "UTR",
      "Coupon",
      "Total Amount",
      "Payment Status",
      "Created At"
    ];

    let csv = "\uFEFF" + headers.join(",") + "\n";

    registrations.forEach(reg => {

      const primary = reg.members[0];

      const row = [
        reg.registrationId,
        primary?.name || "",
        primary?.email || "",
        primary?.whatsapp || "",
        reg.totalMembers,
        reg.utrNumber || "",
        reg.appliedCoupon || "",
        reg.totalAmount,
        reg.paymentStatus,
        new Date(reg.createdAt).toLocaleString("en-IN")
      ].map(x => `"${x}"`).join(",");

      csv += row + "\n";

    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "registrations.csv";

    a.click();
  };

  const sendQRCode = async (user: Registration) => {

  setSendingQr(prev => ({ ...prev, [user.registrationId]: true }));

  try {

    const primary = user.members?.[0];

    if (!primary?.email) {
      toast.error("Primary member email missing");
      return;
    }

    if (!user.qrCode) {
      toast.error("QR code not generated yet");
      return;
    }

    const response = await fetch("/api/sendQr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: primary.email,
        qrCodeImage: user.qrCode,
        name: primary.name,
        registrationId: user.registrationId,
        totalMembers: user.totalMembers
      })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    toast.success("QR code sent successfully");

    await fetch("/api/updateQrStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        registrationId: user.registrationId
      })
    });

    setRegistrations(prev =>
      prev.map(r =>
        r.registrationId === user.registrationId
          ? { ...r, qrSent: true }
          : r
      )
    );

  } catch (error) {
    console.error(error);
    toast.error("Failed to send QR code");
  }

  setSendingQr(prev => ({ ...prev, [user.registrationId]: false }));

};

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto">

      {/* Header */}

      <div className="mb-12 flex justify-between">

        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage registrations</p>
        </div>

        <DropdownMenu>

          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <Link href="/admin/dashboard">
              <DropdownMenuItem>
                Dashboard
              </DropdownMenuItem>
            </Link>

            <Link href="/admin/coupons">
              <DropdownMenuItem>
                <Ticket className="mr-2" size={16} />
                Coupons
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem
              className="text-red-500"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2" size={16} />
              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <Card>

          <CardHeader>
            <CardTitle>Total Registrations</CardTitle>
            <CardDescription>All bookings</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">
              {stats.totalRegistrations}
            </p>
          </CardContent>

        </Card>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl p-8 shadow">

        <div className="flex justify-end mb-6">

          <Button onClick={exportUserDetailsToExcel}>
            <Download className="mr-2" size={16} />
            Export CSV
          </Button>

        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-10">No registrations</div>
        ) : (

          <div className="border rounded-lg overflow-auto">

            <Table>

              <TableHeader>

                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>UTR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR Ticket</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>

              </TableHeader>

              <TableBody>

                {registrations.map(user => {

                  const primary = user.members[0];

                  return (

                    <TableRow key={user.registrationId}>

                      <TableCell>{primary?.name}</TableCell>

                      <TableCell>{primary?.email}</TableCell>

                      <TableCell>{user.totalMembers}</TableCell>

                      <TableCell>{user.utrNumber}</TableCell>

                      <TableCell>

                        {user.paymentStatus === "verified" && (
                          <Badge className="bg-green-100 text-green-600">
                            Verified
                          </Badge>
                        )}

                        {user.paymentStatus === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-600">
                            Pending
                          </Badge>
                        )}

                        {user.paymentStatus === "failed" && (
                          <Badge className="bg-red-100 text-red-600">
                            Failed
                          </Badge>
                        )}

                      </TableCell>

                      <TableCell>

                        <Button
                          size="sm"
                          onClick={() => sendQRCode(user)}
                          disabled={user.qrSent || sendingQr[user.registrationId]}
                        >

                          <Send size={14} className="mr-1" />

                          {user.qrSent
                            ? "Sent"
                            : sendingQr[user.registrationId]
                              ? "Sending..."
                              : "Send QR"
                          }

                        </Button>

                      </TableCell>

                      <TableCell>

                        <Dialog>

                          <DialogTrigger asChild>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedUser(user)}
                            >

                              <FileText size={14} className="mr-1" />
                              View

                            </Button>

                          </DialogTrigger>

                          <DialogContent>

                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                            </DialogHeader>

                            {selectedUser && (

                              <div className="space-y-3">

                                <p><b>ID:</b> {selectedUser.registrationId}</p>

                                <p><b>Total Members:</b> {selectedUser.totalMembers}</p>

                                <p><b>Total Amount:</b> ₹{selectedUser.totalAmount}</p>

                                <p><b>UTR:</b> {selectedUser.utrNumber}</p>

                                <p><b>Coupon:</b> {selectedUser.appliedCoupon || "None"}</p>

                                <p className="font-semibold mt-4">Members</p>

                                {selectedUser.members.map((m, i) => (

                                  <div key={i} className="border p-2 rounded">

                                    <p><b>Name:</b> {m.name}</p>
                                    <p><b>Email:</b> {m.email}</p>
                                    <p><b>Phone:</b> {m.whatsapp || "-"}</p>

                                  </div>

                                ))}

                              </div>

                            )}

                          </DialogContent>

                        </Dialog>

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