import React from "react";
import DashboardMenu from "@/components/dashboard/DashboardMenu";
import ToastNotification from "@/components/ui/ToastNotification";
import { verifySession } from "@/src/auth/dal";
import { InteractiveMenu } from "@/components/menu/menuInterac";
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isAuth } = await verifySession();
  const { accountOwner } = user;

  return (
    <>
      <section className="flex flex-row bg-[#25313D]">
        <section className="relative">
          <InteractiveMenu owner={accountOwner} isAuth={isAuth} />
        </section>
        <section className="container w-[1980px] h-auto py-2 my-4 rounded-2xl shadow-lg bg-slate-100 ">
          <section className="flex flex-row gap-5 px-10 py-4 justify-between items-center border-b  border-opacity-15 border-neutral-800">
            <div>breadcrumb</div>
            <div className="flex flex-row gap-5">
              <h1 className="mb-4 mt-2">
                <span className="font-bold">Usuario {" "}</span>
                <span className="ml-1">{user.name} {user.lastName}</span>{" "}
              </h1>
              <DashboardMenu user={user} />
            </div>
          </section>
          <section className="px-4 my-5">{children}</section>
        </section>
      </section>
      <ToastNotification />
    </>
  );
}
