"use client"

import { useEffect, useState } from "react";
import { getProjects, getCommentById, getProjectsUsers } from "@/src/API/client-fetching-action";
import { ProjectTypes, Comments, ProjectArrayType, User} from "@/src/schemas";
import { getColumns } from "@/components/projects/project-table/columns";
import { DataTable } from "@/components/projects/project-table/table-data";
import { ProjectModal } from "@/components/projects/project-table-modal/ProjectModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { resetStatus } from "@/src/Store";

export default function TableProject({ user }: { user: User }) {
    const dispatch = useDispatch();
    const [projects, setProjects] = useState<ProjectTypes[]>([]);

    const reFetch = useSelector((state: RootState) => state.value.value);
    const [selectedIndex, setSelectedIndex] = useState<ProjectTypes | null>(null);
    const [projectComment, setProjectComment] = useState<Comments | null>(null);

    const projectid = selectedIndex?.id

    useEffect(() => {
        if(reFetch === 'idle') {
            async function projectResources(userId: number) {
                const projectsOk = await getProjects(userId);
                const projectsAssigned = await getProjectsUsers(userId);
                const jointProjects = projectsOk.concat(projectsAssigned);
                const noRepeatId = (uniqueProjects: ProjectArrayType) => {
                    const seenIds = new Set();
                    return uniqueProjects.filter((project)=> {
                        if(seenIds.has(project.id)) return false;
                        seenIds.add(project.id);
                        return true;
                    })
                }
                const uniqueProjects = noRepeatId(jointProjects);
                setProjects(uniqueProjects);
                const projectId = selectedIndex?.id ?? 0;
                const prjComents = await getCommentById(projectId);
                setProjectComment(prjComents);
                setSelectedIndex(selectedIndex)
                console.log('control this fn')
            }
            projectResources(user.id).then();
        };
        dispatch(resetStatus());
    }, [user.id, reFetch, selectedIndex, dispatch, projectid]);

    const columns = getColumns(setSelectedIndex)

    const currentIndex = selectedIndex ? projects.findIndex(prj => prj.id === projectid): -1

    const goNext = () => {
        if(currentIndex === -1)
            return
        if(currentIndex > 0){
            setSelectedIndex(projects[currentIndex + 1])
        }
    }

    const goPrevious = () => {
        if(currentIndex === -1)
            return
        if(currentIndex > 0){
            setSelectedIndex(projects[currentIndex - 1])
        }
    }

    return (
        <>
            <div className="mb-5">
                <DataTable 
                    columns={columns} 
                    data={projects}
                    selectedProject={selectedIndex}
                    onSelectedProject={(project: ProjectTypes)=> setSelectedIndex(project)}
                />
                <ProjectModal
                    comments={projectComment}
                    data={selectedIndex}
                    onClose={()=> setSelectedIndex(null)}
                    user={user}
                    goNext={()=>setSelectedIndex(selectedIndex)}
                    goPrevious={()=>setSelectedIndex(selectedIndex)}
                />
            </div>
        </>
    )
}