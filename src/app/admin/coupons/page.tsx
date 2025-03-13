'use client';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, Menu, Pencil, Ticket } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface Coupon {
  _id: string;
  name: string;
  assignedTo: string;
  quantity: number;
  discount: number;
}

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState({ name: "", assignedTo: "", quantity: 1, discount: 0 });
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/coupons");
      const data = await response.json();
      setCoupons(data);
    } catch {
      toast.error("Failed to fetch coupons.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async () => {
    setLoading(true);
    if (!newCoupon.name || !newCoupon.assignedTo || newCoupon.quantity <= 0 || newCoupon.discount <= 0) {
      toast.error("Please enter valid coupon details");
      return;
    }

    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });

      if (response.ok) {
        toast.success("Coupon added successfully");
        setNewCoupon({ name: "", assignedTo: "", quantity: 1, discount: 0 });
        fetchCoupons();
      } else {
        toast.error("Failed to add coupon");
      }
    } catch {
      toast.error("Error adding coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCoupon = async () => {
    if (!editCoupon) return;
    setEditLoading(true);

    try {
      const response = await fetch(`/api/coupons/${editCoupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCoupon.name,
          assignedTo: editCoupon.assignedTo,
          quantity: editCoupon.quantity,
          discount: editCoupon.discount
        }),
      });


      if (response.ok) {
        toast.success("Coupon updated successfully");
        fetchCoupons();
        setIsEditDialogOpen(false);
      } else {
        toast.error("Failed to update coupon");
      }
    } catch {
      toast.error("Error updating coupon");
    } finally {
      setEditLoading(false);
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add Coupon</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label className="mb-2">Coupon Name</Label>
            <Input value={newCoupon.name} onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2">Assigned To</Label>
            <Input value={newCoupon.assignedTo} onChange={(e) => setNewCoupon({ ...newCoupon, assignedTo: e.target.value })} />
          </div>
          <div>
            <Label className="mb-2">Quantity</Label>
            <Input type="number" value={newCoupon.quantity} onChange={(e) => setNewCoupon({ ...newCoupon, quantity: Number(e.target.value) })} />
          </div>
          <div>
            <Label className="mb-2">Discount %</Label>
            <Input type="number" value={newCoupon.discount} onChange={(e) => setNewCoupon({ ...newCoupon, discount: Number(e.target.value) })} />
          </div>
          <div className="flex items-end">
          <Button onClick={handleAddCoupon} className="w-full cursor-pointer" disabled={loading}>{loading ? 'Adding...' : 'Add Coupon'}</Button>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Name</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon._id}>
              <TableCell>{coupon.name}</TableCell>
              <TableCell>{coupon.assignedTo}</TableCell>
              <TableCell>{coupon.quantity}</TableCell>
              <TableCell>{coupon.discount}%</TableCell>
              <TableCell className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => handleEditClick(coupon)} className="cursor-pointer">
                  <Pencil size={16} />
                </Button>
              </TableCell>


            </TableRow>
          ))}
        </TableBody>
      </Table>


      {/* Edit Coupon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
          </DialogHeader>
          {editCoupon && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label className="mb-2">Coupon Name</Label>
                <Input value={editCoupon.name} onChange={(e) => setEditCoupon({ ...editCoupon, name: e.target.value })} />
              </div>
              <div>
                <Label className="mb-2">Assigned To</Label>
                <Input value={editCoupon.assignedTo} onChange={(e) => setEditCoupon({ ...editCoupon, assignedTo: e.target.value })} />
              </div>
              <div>
                <Label className="mb-2">Quantity</Label>
                <Input type="number" value={editCoupon.quantity} onChange={(e) => setEditCoupon({ ...editCoupon, quantity: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="mb-2">Discount %</Label>
                <Input type="number" value={editCoupon.discount} onChange={(e) => setEditCoupon({ ...editCoupon, discount: Number(e.target.value) })} />
              </div>
              <Button onClick={handleUpdateCoupon} className="w-full cursor-pointer" disabled={editLoading}>{editLoading ? 'Updating...' : 'Update Coupon'}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coupons;
