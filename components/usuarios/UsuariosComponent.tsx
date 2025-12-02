"use client"

import { useEffect, useState } from "react";
import { UserTable, UserArray } from "@/src/schemas";
import { getUserColumns } from "@/components/usuarios/user-table/columns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { DataUsersTable } from "@/components/usuarios/user-table/table-data"
import { resetStatus } from "@/src/Store";


export default function UsersComponent({secret, token}:{secret: string, token: string}) {
    const dispatch = useDispatch();
    const [users, setUsers] = useState<UserTable[]>([]);
    const reFetch = useSelector((state: RootState) => state.value.value);
    const [selectedIndex, setSelectedIndex] = useState<UserTable | null>(null);

    useEffect(() => {
        if(reFetch === 'idle') {
            const fetchUrl: string = `${secret}/users/active/users`
            const userResources = async () => {
                const request = fetch(fetchUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const activeUsers = (await request).json();
                const settingUpUsers = UserArray.parse(activeUsers)
                setUsers(settingUpUsers);
            }
            userResources();
        }
        dispatch(resetStatus());
    }, [reFetch, dispatch]);
    const columns = getUserColumns(setSelectedIndex);

    return (
        <>
            <section className={"bg-slate-100"}>
                <h1 className="text-xl font-semibold mt-6">Usuarios Activos</h1>
                <DataUsersTable columns={columns} data={users} />
            </section>
        </>
    )
}