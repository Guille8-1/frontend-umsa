import { verifySession } from "@/src/auth/dal";
import DashboardStart from "@/components/dashboard/MainDashboard";
import Loading from "./loading";
import { Suspense } from "react";
import 'dotenv/config';

export default async function DashboardMain() {
  const { user, isAuth, token } = await verifySession();
  const chPassword: boolean = user.changedPw;
  const secret: string = process.env.BACK_URL ?? '';

  return (
    <>
      <Suspense fallback={<Loading />}>
        <DashboardStart
          chPassword={chPassword}
          isAuth={isAuth}
          token={token}
          secret={secret}
        />
      </Suspense>
    </>
  );
}
