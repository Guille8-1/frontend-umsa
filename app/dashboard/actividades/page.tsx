import { ActivityActionPage } from '@/components/actividades/ActivityActionPage';
import TableActivity from '@/components/actividades/activity-table/table-activity-data';
import { verifySession } from "@/src/auth/dal";
import "dotenv/config"

export default async function ActivityPage() {
  const secret: string = process.env.BACK_URL ?? '';
  const { user, token } = await verifySession();
  const { admin } = user;
  const { nivel } = user;
  const { id } = user;

  return (
    <>
      <section className="h-auto">
        <ActivityActionPage
          secret={secret}
          token={token}
          admin={admin}
        />
        <TableActivity
          nivel={nivel}
          id={id}
          secret={secret}
          token={token}
        />
      </section>
    </>
  )
}
