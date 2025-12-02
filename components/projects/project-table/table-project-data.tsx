"use client"

import { useEffect, useState } from "react";
import { ProjectTypes, Comments, User, ProjectsFullArray} from "@/src/schemas";
import { getColumns } from "@/components/projects/project-table/columns";
import { DataTable } from "@/components/projects/project-table/table-data";
import { ProjectModal } from "@/components/projects/project-table-modal/ProjectModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { resetStatus } from "@/src/Store";

export default function TableProject(
    { user, url, token }: 
    { user: User, url: string, token: string }
) {

    const dispatch = useDispatch();
    const [projects, setProjects] = useState<ProjectTypes[]>([]);

    const reFetch = useSelector((state: RootState) => state.value.value);
    const [selectedIndex, setSelectedIndex] = useState<ProjectTypes | null>(null);
    const [projectComment, setProjectComment] = useState<Comments | null>(null);

    const projectid = selectedIndex?.id

    useEffect(() => {
        if(reFetch === 'idle') {
            const projectId = selectedIndex?.id ?? 0;
            const prjResources = async (id: number) => {
                const fetchUrl: string = `${url}/projects/user/${id}`
                const request = await fetch(fetchUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const prjFullArray = await request.json()
                const setUpProjectResources = ProjectsFullArray.parse(prjFullArray);
                setProjects(setUpProjectResources);
            }
            prjResources(user.id);

            const commentsFetch = async (id: number) => {
                const fetchUrl: string = `${url}/projects/comment/project/${id}`
                const request = await fetch(fetchUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const comments = await request.json()
                setProjectComment(comments)
            }
            commentsFetch(projectId);

            setSelectedIndex(selectedIndex)
            async function projectResources() {
            }
            projectResources().then();
        };
        dispatch(resetStatus());
    }, [user.id, reFetch, selectedIndex, dispatch, projectid]);

    const columns = getColumns(setSelectedIndex)

    const currentIndex = selectedIndex ? projects.findIndex(prj => prj.id === projectid): -1
    
    const goNext = () => {
        if(currentIndex === -1)
            return
        if(currentIndex < projects.length - 1){
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
                    url={url}
                    token={token}
                    goNext={goNext}
                    goPrevious={goPrevious}
                />
            </div>
        </>
    )
}
