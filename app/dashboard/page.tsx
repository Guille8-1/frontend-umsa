import { verifySession } from "@/src/auth/dal";
import DashboardStart from "@/components/dashboard/MainDashboard";
import Loading from "./loading";
import { Suspense } from "react";

export default async function DashboardMain() {
  const { user } = await verifySession();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <DashboardStart user={user} />
      </Suspense>
    </>
  );
}
