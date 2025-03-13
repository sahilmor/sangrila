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
    createdAt: string;
    utrNumber: string;
}

const AcountsDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
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
            const response = await fetch("/api/admin/registerations");
            const data = await response.json();

            setUserDetails(data);

            const totalRegistrations = data.length;
            const totalVerified = data.filter((user: UserDetails) => user.paymentStatus.toLowerCase() === "verified").length;
            const totalPending = data.filter((user: UserDetails) => user.paymentStatus.toLowerCase() === "pending").length;
            const totalFailed = data.filter((user: UserDetails) => user.paymentStatus.toLowerCase() === "failed").length;


            setStats({ totalRegistrations, totalVerified, totalPending, totalFailed });
        } catch {
            toast.error("Failed! Please try again.");
        }
        setIsLoading(false);
    };

    const updatePaymentStatus = async (registrationId: string, status: "verified" | "failed") => {
        setLoadingStatus((prev) => ({ ...prev, [registrationId]: true }));
        try {
            const response = await fetch("/api/confirmPayment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationId, status }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
    
            toast.success(`Payment status updated to ${status}`);
            fetchData(); // Refresh data after updating
        } catch {
            toast.error("Failed to update payment status.");
        }
        setLoadingStatus((prev) => ({ ...prev, [registrationId]: false }));
    };
    
    

    return (
        <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto mt-6">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold">Accounts Dashboard</h1>
                    <p className="mt-2 text-gray-600">Manage Payment details</p>
                </div>
                <Button onClick={() => signOut({ callbackUrl: "/login" })} className="cursor-pointer">
                    Logout
                </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Registrations</CardTitle>
                        <CardDescription>All user registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Verified Payments</CardTitle>
                        <CardDescription>All Verified Payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalVerified}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending Payments</CardTitle>
                        <CardDescription>All Pending Payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalPending}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Failed Payments</CardTitle>
                        <CardDescription>All Failed Payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalFailed}</p>
                    </CardContent>
                </Card>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-xl p-8 shadow-subtle">

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sangrila-600 mx-auto mb-4"></div>
                        <p>Loading user registrations...</p>
                    </div>
                ) : userDetails.length > 0 ? (
                    <div className="rounded-md border overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>UTR</TableHead>
                                    <TableHead>Payment Verified</TableHead>
                                    <TableHead>Confirm Payment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userDetails.map((user) => (
                                    <TableRow key={user.registrationId || user.email || Math.random()}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.whatsapp || "-"}</TableCell>
                                        <TableCell>{user.utrNumber || "N/A"}</TableCell>
                                        <TableCell>
                                            {user.paymentStatus.toLowerCase() === "verified" ? (
                                                <Badge variant="default" className="text-green-600 bg-green-100">
                                                    Verified
                                                </Badge>
                                            ) : user.paymentStatus.toLowerCase() === "failed" ? (
                                                <Badge variant="destructive" className="text-red-600 bg-red-100">
                                                    Failed
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-yellow-600 bg-yellow-100">
                                                    Pending
                                                </Badge>
                                            )}
                                        </TableCell>

                                        <TableCell className="flex gap-2 items-center">
                                        <Button
                                            size="sm"
                                            className="flex items-center gap-1 cursor-pointer w-[45%] bg-green-500 text-black hover:bg-green-400"
                                            onClick={() => updatePaymentStatus(user.registrationId, "verified")}
                                            disabled={user.paymentStatus.toLowerCase() === "verified" || user.paymentStatus.toLowerCase() === "failed" || loadingStatus[user.registrationId]}
                                        >
                                            {loadingStatus[user.registrationId] ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                                            {user.paymentStatus.toLowerCase() === "verified" ? "Verified" : "Verify"}
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="flex items-center gap-1 cursor-pointer w-[45%] bg-red-500 text-black hover:bg-red-400"
                                            onClick={() => updatePaymentStatus(user.registrationId, "failed")}
                                            disabled={user.paymentStatus.toLowerCase() === "verified" || user.paymentStatus.toLowerCase() === "failed" || loadingStatus[user.registrationId]}
                                        >
                                            {loadingStatus[user.registrationId] ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />}
                                            {user.paymentStatus.toLowerCase() === "failed" ? "Failed" : "Fail"}
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

export default AcountsDashboard;
