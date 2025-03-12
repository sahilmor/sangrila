"use client";

import AccessDenied from "@/components/layout/AccessDenied";
import Loading from "@/components/layout/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "./dashboard/page";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (!session || session.user.role !== "admin") {
    return (
      <>
        <AccessDenied />
      </>
    );
  }

  return (
    <div>
      <AdminDashboard />
    </div>
  );
};

export default AdminPage;
