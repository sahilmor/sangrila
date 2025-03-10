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
import { Download, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

interface UserDetails {
    registrationId: string;
    name: string;
    email: string;
    whatsapp: string;
    address: string;
    registerationType: string;
    additionalMembers: number;
    createdAt: string;
}

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        totalGuests: 0,
        totalSchools: 0
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
            const totalGuests = data.filter((user: UserDetails) => user.registerationType.toLowerCase() === "guest").length;
            const totalSchools = data.filter((user: UserDetails) => user.registerationType.toLowerCase() === "school").length;

            setStats({ totalRegistrations, totalGuests, totalSchools });
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
        let csvContent = "Registration ID,Name,Email,Phone,Registration Type,Additional Members,Date\n";

        userDetails.forEach(user => {
            const row = [
                user.registrationId,
                user.name,
                user.email,
                user.whatsapp || '',
                user.registerationType,
                user.additionalMembers,
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

    return (
        <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto mt-6">
            <div className="mb-12 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage registration details</p>
            </div>
            <div>
                <Button onClick={() => signOut()}>
                    Logout
                </Button>
            </div>
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

                <Card>
                    <CardHeader>
                        <CardTitle>Total Guest Registrations</CardTitle>
                        <CardDescription>All guest registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalGuests}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Total School Registrations</CardTitle>
                        <CardDescription>All principal / school registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalSchools}</p>
                    </CardContent>
                </Card>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-xl p-8 shadow-subtle">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex justify-end w-full">
                        <Button onClick={exportUserDetailsToExcel} className="flex gap-2 items-center">
                            <Download size={16} />
                            Export to CSV
                        </Button>
                    </div>
                </div>

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
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Registration Type</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead>Registration Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userDetails.map((user) => (
                                    <TableRow key={user.registrationId || user.email || Math.random()}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.whatsapp || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {user.registerationType}
                                            </Badge>
                                        </TableCell>
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
                                                            <p><strong>Registration Type:</strong> {selectedUser.registerationType}</p>
                                                            <p><strong>Additional Members:</strong> {selectedUser.additionalMembers}</p>
                                                            <p><strong>Registration Date:</strong> {formatDate(selectedUser.createdAt)}</p>
                                                        </div>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>{formatDate(user.createdAt)}</TableCell>
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
