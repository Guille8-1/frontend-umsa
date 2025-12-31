"use client"

import { useEffect, useState } from "react";
import { UserTable, UserArray } from "@/src/schemas";
import { getUserColumns } from "@/components/usuarios/user-table/columns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { DataUsersTable } from "@/components/usuarios/user-table/table-data"
import { resetStatus } from "@/src/Store";
import { TiPlus } from "react-icons/ti";
import Link from 'next/link';


export default function UsersComponent({ secret, token }: { secret: string, token: string }) {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<UserTable[]>([]);
  const reFetch = useSelector((state: RootState) => state.value.value);
  const [selectedIndex, setSelectedIndex] = useState<UserTable | null>(null);

  useEffect(() => {
    if (reFetch === 'idle') {
      const fetchUrl: string = `${secret}/users/active/users`;
      const userResources = async () => {
        const request = await fetch(fetchUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        const activeUsers = await request.json();
        const settingUpUsers = UserArray.parse(activeUsers);
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
        <section className="flex flex-row align-items-center justify-items-center gap-2 bg-sky-800 p-3 text-gray-200 rounded w-44 text-lg">
          <TiPlus size="1.1em" className="mt-0.5" />
          <Link href='/create-user'>
            Crear Usuarios
          </Link>
        </section>
        <DataUsersTable columns={columns} data={users} />
      </section>
    </>
  )
}
