
import TableProject from "@/components/projects/project-table/table-project-data";
import { ProjectsActionsPage } from "@/components/projects/ProjectsActionsPage";
import { ReportAction } from "@/components/projects/ReportAction";
import { verifySession } from "@/src/auth/dal";
import "dotenv";


export default async function ProjectsPage() {
  const url: string = process.env.BACK_URL ?? '';
  const { user, token } = await verifySession();
  const toGetReport = {...user, userToken: token};
  const { admin } = user;
  const { nivel } = user;
  const { id } = user;
  

  return (
    <>
        <section className="h-auto">
            <section className='flex flex-row gap-5'>
                <ProjectsActionsPage
                  url={url}
                  token={token}
                  admin={admin}
                />
                <ReportAction 
                  user={toGetReport}
                  urlSafe={url}
                />
            </section>

            <TableProject
              user={user}
              token={token}
              url={url}
            />

        </section>
    </>
  );
}
