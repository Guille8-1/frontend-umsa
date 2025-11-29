"use client";

import { useEffect, useState } from "react";
import { getActivity, getCommentByIdActivity } from "@/src/API/client-fetching-action";
import { ActivityTypes, CommentsActivity, User } from "@/src/schemas";
import { getColumns } from "@/components/actividades/activity-table/columns";
import { DataTable } from "@/components/actividades/activity-table/table-data";
import { ActividadModal } from "@/components/actividades/activity-table-modal/ActividadModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { resetStatus } from "@/src/Store";

export default function TableActivity({ user }: { user: User }) {
    const dispatch = useDispatch();
    const [activity, setActivity] = useState<ActivityTypes[]>([]);

    const reFetch = useSelector((state: RootState) => state.value.value);
    const [selectedIndex, setSelectedIndex] = useState<ActivityTypes | null>(null);
    const [activityComment, setActivityComment] = useState<CommentsActivity | null>(null)
    const activityId = selectedIndex?.id

    useEffect(() => {
        if (reFetch === 'idle') {
            async function activityResources(userId: number) {
                const activityOk = await getActivity(userId);
                setActivity(activityOk);
                const activityId = selectedIndex?.id ?? 0;
                const activityComments = await getCommentByIdActivity(activityId);
                setActivityComment(activityComments)
                setSelectedIndex(selectedIndex);
            }
            activityResources(user.id).then()
        }
        dispatch(resetStatus());
        console.log('testing this call from modals and projects')
    }, [user.id, activityId, selectedIndex, dispatch, reFetch])

    const columns = getColumns(setSelectedIndex);

    const currentIndex = selectedIndex ? activity.findIndex(act => act.id === activityId) : -1

    const goNext = () => {
        if (currentIndex === -1)
            return
        if (currentIndex < activity.length - 1) {
            setSelectedIndex(activity[currentIndex + 1])
        }
    }

    const goPrevious = () => {
        if (currentIndex === -1)
            return
        if (currentIndex > 0) {
            setSelectedIndex(activity[currentIndex - 1])
        }
    }


    return (
        <>
            <div className="mb-5">
                <DataTable
                    columns={columns}
                    data={activity}
                    selectedActivity={selectedIndex}
                    onSelectedActivity={(project: ActivityTypes) => setSelectedIndex(project)}
                />
                <ActividadModal
                    comments={activityComment}
                    data={selectedIndex}
                    onClose={() => setSelectedIndex(null)}
                    user={user}
                    goPrevious={goPrevious}
                    goNext={goNext}
                />
            </div>
        </>
    )
}
