"use client";

import AccessDenied from "@/components/layout/AccessDenied";
import Loading from "@/components/layout/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AcountsDashboard from "./dashboard/page";

const AccountsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  }

  if (!session || session.user.role !== "accountant") {
    return (
      <>
        <AccessDenied />
      </>
    );
  }

  return (
    <div>
      <AcountsDashboard />
    </div>
  );
};

export default AccountsPage;
