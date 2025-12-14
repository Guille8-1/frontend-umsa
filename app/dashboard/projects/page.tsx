import TableProject from "@/components/projects/project-table/table-project-data";
import { ProjectsActionsPage } from "@/components/projects/ProjectsActionsPage";
import { ReportAction } from "@/components/projects/ReportAction";
import { verifySession } from "@/src/auth/dal";
import "dotenv";

export default async function ProjectsPage() {
  const url: string = process.env.BACK_URL ?? "";
  const { user, token } = await verifySession();
  const toGetReport = { ...user, userToken: token };
<<<<<<< HEAD
  const url: string = process.env.BACK_URL ?? '';
  console.log('testing git push from mac to test results');
=======
  const { admin } = user;
>>>>>>> a10acf7981ea4e58f4a9c24c9f6d829ec64182d7

  return (
    <>
      <section className="h-auto">
<<<<<<< HEAD
        <section className='flex flex-row gap-5'>
          <ProjectsActionsPage user={user} />
          <ReportAction user={toGetReport} urlSafe={url} />
        </section>
        <TableProject user={user} />
=======
        <section className="flex flex-row gap-5">
          <ProjectsActionsPage url={url} token={token} admin={admin} />
          <ReportAction user={toGetReport} urlSafe={url} />
        </section>

        <TableProject user={user} token={token} url={url} />
>>>>>>> a10acf7981ea4e58f4a9c24c9f6d829ec64182d7
      </section>
    </>
  );
}
