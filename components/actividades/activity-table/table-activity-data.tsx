"use client";

import { useEffect, useState } from "react";
import { ActivityTypes, CommentsActivity } from "@/src/schemas";
import { getColumns } from "@/components/actividades/activity-table/columns";
import { DataTable } from "@/components/actividades/activity-table/table-data";
import { ActividadModal } from "@/components/actividades/activity-table-modal/ActividadModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { resetStatus } from "@/src/Store";

export default function TableActivity({ nivel, id, token, secret }: { nivel: number, id: number, token: string, secret: string }) {

    const dispatch = useDispatch();
    const [activity, setActivity] = useState<ActivityTypes[]>([]);

    const reFetch = useSelector((state: RootState) => state.value.value);
    const [selectedIndex, setSelectedIndex] = useState<ActivityTypes | null>(null);
    const [activityComment, setActivityComment] = useState<CommentsActivity | null>(null)
    const activityId = selectedIndex?.id ?? 0;

    useEffect(() => {
        if (reFetch === 'idle') {
            setTimeout(() => {
                const getActivity = async (id: number, token: string, secret: string) => {
                      const url: string = `${secret}/actividades/user/${id}`;
                      const request = await fetch(url, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                    const activityOk = await request.json();
                    setActivity(activityOk);
                    console.log('refetching')
                    console.log('last record should appear hear...', activity)
                }
                getActivity(id, token, secret)
            }, 800);

            setTimeout(() => {
                const getCommentAct = async (token: string, secret: string) => {
                    const url: string = `${secret}/actividades/comment/activity/${activityId}`
                    const request = await fetch(url, {
                        headers:{
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const activityComments = await request.json()
                    setActivityComment(activityComments)
                }
                getCommentAct(token, secret)
            }, 800);

            setSelectedIndex(selectedIndex);
            console.log('running... how many??')
        }
        dispatch(resetStatus());
        console.log('testing this call from modals and activities')
    }, [dispatch, reFetch])

    //id, activityId, selectedIndex

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
                    nivel={nivel}
                    goPrevious={goPrevious}
                    goNext={goNext}
                    token={token}
                    secret={secret}
                />
            </div>
        </>
    )
}
