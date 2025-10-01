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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface UserDetails {
    registrationId: string;
    name: string;
    email: string;
    whatsapp: string;
    address: string;
    registrationType: string;
    additionalMembers: number;
    paymentStatus: string;
    qrCode: string;
    qrSent: boolean;
    totalAmount: number;
    utrNumber: string;
    referredBy: {type: String},
    referenceContact: {type: Number},
    createdAt: string;
    appliedCoupon?: string;
    couponDetails?: {
        name: string;
        assignedTo: string;
        discount: number;
    } | null;
}


const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [sendingQr, setSendingQr] = useState<{ [key: string]: boolean }>({});
    const [stats, setStats] = useState({
        totalRegistrations: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/registerations");
            const data = await response.json();

            setUserDetails(data);

            const totalRegistrations = data.length;
            const totalGuests = data.filter((user: UserDetails) => user.registrationType.toLowerCase() === "guest").length;

            setStats({ totalRegistrations });
        } catch {
            toast.error("Failed! Please try again.");
        }
        setIsLoading(false);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const exportUserDetailsToExcel = () => {
        let csvContent = "Registration ID,Name,Email,Phone,Registration Type,utrNumber,referredBy,referenceContact,Date\n";

        userDetails.forEach(user => {
            const row = [
                user.registrationId,
                user.name,
                user.email,
                user.whatsapp || '',
                user.registrationType,
                user.additionalMembers,
                user.paymentStatus,
                user.utrNumber,
                user.referredBy,
                user.referenceContact,
                formatDate(user.createdAt)
            ].join(",");

            csvContent += row + "\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "user_details.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sendQRCode = async (user: UserDetails) => {
        setSendingQr((prev) => ({ ...prev, [user.registrationId]: true }));
        try {
            const response = await fetch("/api/sendQr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email, qrCodeImage: user.qrCode }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("QR code sent successfully!");

                await fetch("/api/updateQrStatus", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ registrationId: user.registrationId }),
                });

                setUserDetails((prev) =>
                    prev.map((u) =>
                        u.registrationId === user.registrationId ? { ...u, qrSent: true } : u
                    )
                );
            } else {
                toast.error(data.message || "Failed to send QR code");
            }
        } catch (error) {
            console.error("QR Code Sending Error:", error);
            toast.error("Error sending QR code");
        } finally {
            setSendingQr((prev) => ({ ...prev, [user.registrationId]: false }));
        }
    };

    return (
        <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto mt-6">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage registration details</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu size={24} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href="/admin/dashboard">
                            <DropdownMenuItem>
                                <Menu size={16} className="mr-2" />
                                Dashboard
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/admin/coupons">
                            <DropdownMenuItem>
                                <Ticket size={16} className="mr-2" />
                                Manage Coupons
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-500">
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Registrations</CardTitle>
                        <CardDescription>All user registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
                    </CardContent>
                </Card>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-xl p-8 shadow-subtle">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex justify-end w-full">
                        <Button onClick={exportUserDetailsToExcel} className="flex gap-2 items-center cursor-pointer">
                            <Download size={16} />
                            Export to CSV
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Agaaz-600 mx-auto mb-4"></div>
                        <p>Loading user registrations...</p>
                    </div>
                ) : userDetails.length > 0 ? (
                    <div className="rounded-md border overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Payment Verified</TableHead>
                                    <TableHead>Send QR Ticket</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userDetails.map((user) => (
                                    <TableRow key={user.registrationId || user.email || Math.random()}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.whatsapp || "-"}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                        onClick={() => setSelectedUser(user)}
                                                    >
                                                        <FileText size={14} />
                                                        View
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>User Details</DialogTitle>
                                                    </DialogHeader>
                                                    {selectedUser && (
                                                        <div className="space-y-4">
                                                            <p><strong>ID:</strong> {selectedUser.registrationId}</p>
                                                            <p><strong>Name:</strong> {selectedUser.name}</p>
                                                            <p><strong>Email:</strong> {selectedUser.email}</p>
                                                            <p><strong>Phone:</strong> {selectedUser.whatsapp || "-"}</p>
                                                            <p><strong>Registration Type:</strong> {selectedUser.registrationType}</p>
                                                            <p><strong>Additional Members:</strong> {selectedUser.additionalMembers}</p>
                                                            <p><strong>Payment Status:</strong> {selectedUser.paymentStatus}</p>
                                                            <p><strong>Total Payment:</strong> {selectedUser.totalAmount}</p>

                                                            {selectedUser.couponDetails ? (
                                                                <div className="border-t pt-4 mt-4 space-y-4">
                                                                    <h3 className="text-lg font-semibold">Coupon Details</h3>
                                                                    <p><strong>Coupon Code:</strong> {selectedUser.couponDetails.name}</p>
                                                                    <p><strong>Assigned To:</strong> {selectedUser.couponDetails.assignedTo}</p>
                                                                    <p><strong>Discount:</strong> {selectedUser.couponDetails.discount}%</p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500">No coupon applied.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>

                                        </TableCell>
                                        <TableCell>
                                            {user.paymentStatus === "verified" ? (
                                                <Badge variant="default" className="text-green-600 bg-green-100">
                                                    Verified
                                                </Badge>
                                            ) : user.paymentStatus === "failed" ? (
                                                <Badge variant="destructive" className="text-red-600 bg-red-100">
                                                    Failed
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-yellow-600 bg-yellow-100">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Button size="sm" className="flex items-center gap-1 cursor-pointer" onClick={() => sendQRCode(user)} disabled={sendingQr[user.registrationId] || user.qrSent}>
                                                <Send size={14} />
                                                {user.qrSent ? "Sent" : sendingQr[user.registrationId] ? "Sending..." : "Send QR"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-12">No user registrations found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
