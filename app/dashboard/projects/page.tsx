
import TableProject from "@/components/projects/project-table/table-project-data";
import { ProjectsActionsPage } from "@/components/projects/ProjectsActionsPage";
import { ReportAction } from "@/components/projects/ReportAction";
import { verifySession } from "@/src/auth/dal";
import "dotenv";


export default async function ProjectsPage() {
  const { user, token } = await verifySession();
  const toGetReport = { ...user, userToken: token };
  const url: string = process.env.BACK_URL ?? '';
  console.log('testing git push from mac to test results');

  return (
    <>
      <section className="h-auto">
        <section className='flex flex-row gap-5'>
          <ProjectsActionsPage user={user} />
          <ReportAction user={toGetReport} urlSafe={url} />
        </section>
        <TableProject user={user} />
      </section>
    </>
  );
}
