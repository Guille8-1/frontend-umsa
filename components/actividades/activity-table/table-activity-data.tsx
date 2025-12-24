"use client";

import { useEffect, useState } from "react";
import { ActivityTypes, CommentsActivity } from "@/src/schemas";
import { getColumns } from "@/components/actividades/activity-table/columns";
import { DataTable } from "@/components/actividades/activity-table/table-data";
import { ActividadModal } from "@/components/actividades/activity-table-modal/ActividadModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { resetStatus } from "@/src/Store";
import CircularIndeterminate from "@/components/projects/project-table/top-progress";

type tableActivityType = {
  nivel: number;
  id: number;
  token: string;
  secret: string;
}

export default function TableActivity({
  nivel,
  id,
  token,
  secret,
}: tableActivityType) {
  const dispatch = useDispatch();
  const [activity, setActivity] = useState<ActivityTypes[]>([]);

  const reFetch = useSelector((state: RootState) => state.value.value);
  const [selectedIndex, setSelectedIndex] = useState<ActivityTypes | null>(null);
  const [activityComment, setActivityComment] = useState<CommentsActivity | null>(null);
  const activityId = selectedIndex?.id ?? 0;
  const [loading, setLoading] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(true);

  useEffect(() => {
    if (reFetch === "idle") {
      const getActivity = async (id: number, token: string, secret: string) => {
        const url: string = `${secret}/actividades/user/${id}`;
        const request = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const activityOk = await request.json();
        setActivity(activityOk);
      };
      setTimeout(() => {
        getActivity(id, token, secret);
        setLoading(false);
      }, 800);

      const getCommentAct = async (token: string, secret: string) => {
        const url: string = `${secret}/actividades/comment/activity/${activityId}`;
        const request = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const activityComments = await request.json();
        setActivityComment(activityComments);
      };
      setTimeout(() => {
        getCommentAct(token, secret);
        setLoader(false);
      }, 800);

      setSelectedIndex(selectedIndex);
    }
    dispatch(resetStatus());
  }, [dispatch, reFetch, activityId, id, secret, selectedIndex, token]);

  //id, activityId, selectedIndex

  const columns = getColumns(setSelectedIndex);

  const currentIndex = selectedIndex
    ? activity.findIndex((act) => act.id === activityId)
    : -1;

  const goNext = () => {
    if (currentIndex === -1) return;
    if (currentIndex < activity.length - 1) {
      setSelectedIndex(activity[currentIndex + 1]);
    }
  };

  const goPrevious = () => {
    if (currentIndex === -1) return;
    if (currentIndex > 0) {
      setSelectedIndex(activity[currentIndex - 1]);
    }
  };

  if (loading || loader) {
    return (
      <>
        <div className="mx-auto flex justify-center items-center h-[26rem]">
          <CircularIndeterminate />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-5">
        <DataTable
          columns={columns}
          data={activity}
          selectedActivity={selectedIndex}
          onSelectedActivity={(project: ActivityTypes) =>
            setSelectedIndex(project)
          }
        />
        <ActividadModal
          comments={activityComment}
          data={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          nivel={nivel}
          goPrevious={goPrevious}
          goNext={goNext}
          token={token}
          secret={secret}
        />
      </div>
    </>
  );
}
