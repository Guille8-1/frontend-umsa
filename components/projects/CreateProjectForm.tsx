"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { createProject } from "@/actions/create-project-action";
import { GetUserType } from "@/src/schemas";
import { toast } from "react-toastify";
//react select
import Select, { MultiValue } from "react-select";
//redux
import { useDispatch } from "react-redux";
import { setValue } from "@/src/Store";
import { TiWarning } from "react-icons/ti";
import Link from "next/link";

export type userOptions = {
  label: string;
  value: string;
  id: number;
};

export default function ProjectForm({ url, token }: { url: string, token: string }) {
  const [state, dispatch] = useActionState(createProject, {
    errors: [],
    success: "",
  });

  const [users, setUsers] = useState<GetUserType>([]);
  const [selectedUsers, setSelectedUsers] = useState<userOptions[] | null>([]);
  const fetchDispatch = useDispatch();
  const dispatchFunction = () => {
    fetchDispatch(setValue("changed"));
  };
  const userOptions: userOptions[] = [];

  const addingUsers = (userAdded: MultiValue<userOptions>) => {
    setSelectedUsers([...userAdded]);
  };

  const userIds: number[] = [];
  const gettingId = selectedUsers ?? [];

  gettingId.map(userId => {
    const { id } = userId;
    userIds.push(id)
  })
  const tokenRef = useRef<HTMLDialogElement>(null);


  useEffect(() => {
    const fetchUsers = async () => {
      const urlFetch: string = `${url}/users/assigned`;
      const request = await fetch(urlFetch, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const isValid: boolean = request.ok ? true : false;

      if (!isValid) {
        tokenRef.current?.showModal();
      }

      const userData: GetUserType = await request.json()
      setUsers(userData)
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [state]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
  }, [state]);

  for (const user of users) {
    const { nombre, apellido } = user;
    const label = `${nombre} ${apellido}`;
    const value = `${nombre} ${apellido}`.toLowerCase();
    const { id } = user;
    userOptions.push({ label, value, id });
  }

  return (
    <>
      <section>
        <dialog className="p-7 rounded-md" ref={tokenRef}>
          <section className="flex flex-col gap-5">
            <div className="flex flex-row items-center gap-2">
              <TiWarning className="text-[#D32F2F] w-8 h-8" />
              <h3 className="font-semibold text-sky-800 text-lg">
                Session Expirada
              </h3>
            </div>

            <Link
              href={"auth/login"}
              autoFocus={false}
              className="text-center p-2 w-1/2 mx-auto border-2 border-solid border-sky-700 bg-slate-100 rounded-md"
            >
              Token Expirado - Log in
            </Link>
          </section>
        </dialog>
      </section>
      <form className="mt-5 space-y-3 " noValidate action={dispatch}>
        <div className="flex flex-row gap-5 justify-center">
          <div className="w-screen">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="email">
                Titulo{" "}
                <span className={"font-bold text-sky-800"}>(Requerido)</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                placeholder="Titulo Proyecto"
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="facultad">
                Tipo de Documento{" "}
                <span className={"font-bold text-sky-800"}>(Requerido)</span>
              </label>
              <input
                id="tipoDocumento"
                name="tipoDocumento"
                type="text"
                placeholder="Nombre del Documento"
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>
            <div className="font-bold text-lg mt-3">
              <label className="font-bold text-lg mt-3" htmlFor="asigandos">
                Usuarios{" "}
                <span className={"font-bold text-sky-800"}>
                  (Máx. 4 Usuarios)
                </span>
              </label>
              <Select
                name="asignados"
                options={userOptions}
                value={selectedUsers}
                onChange={addingUsers}
                className="w-full border border-gray-300 p-3 rounded-lg"
                placeholder="Asignar Usuarios"
                isMulti={true}
                isSearchable={true}
              />
            </div>
            <input type="text" className="hidden" name="ids" defaultValue={userIds.toLocaleString()} />
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="estado">
                Estado{" "}
                <span className={"font-bold text-sky-800"}>(Requerido)</span>
              </label>
              <select
                name="estado"
                id="estado"
                className="w-full border border-gray-300 p-3 rounded-lg"
              >
                <option value="" defaultChecked>
                  Seleccionar
                </option>
                <option value="Activo">Activo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Mora">En Mora</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="tipo">
                Tipo{" "}
                <span className={"font-bold text-sky-800"}>(Requerido)</span>
              </label>
              <select
                name="tipo"
                id="tipo"
                className="w-full border border-gray-300 p-3 rounded-lg"
              >
                <option value="" defaultChecked>
                  Seleccionar
                </option>
                <option value="construccion">Construccion</option>
                <option value="planeacion">Planeacion</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="prioridad">
                Prioridad{" "}
                <span className={"font-bold text-sky-800"}>(Requerido)</span>
              </label>
              <select
                name="prioridad"
                id="prioridad"
                className="w-full border border-gray-300 p-3 rounded-lg"
              >
                <option value="" defaultChecked>
                  Seleccionar
                </option>
                <option value="Urgente">Urgente</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>
          <div className="w-screen">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="email">
                Cite Numero{" "}
                <span className={"font-bold text-red-800"}>(Obligatorio)</span>
              </label>
              <input
                id="citeNumero"
                type="number"
                min={1}
                placeholder="Cite Numero"
                className="w-full border border-gray-300 p-3 rounded-lg appearance-none"
                name="citeNumero"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="email">
                Ruta CV{" "}
                <span className={"font-bold text-red-800"}>(Obligatorio)</span>
              </label>
              <input
                id="rutaCv"
                type="number"
                min={1}
                placeholder="Ruta Cv"
                className="w-full border border-gray-300 p-3 rounded-lg appearance-none no-arrows"
                name="rutaCv"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="email">
                Oficina de Origen
              </label>
              <input
                id="oficinaOrigen"
                type="text"
                placeholder="Oficina de Origen"
                className="w-full border border-gray-300 p-3 rounded-lg appearance-none"
                name="oficinaOrigen"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row align-middle justify-center gap-5">
          <input
            onClick={dispatchFunction}
            className="bg-cyan-800 hover:bg-cyan-700 w-auto p-3 rounded-lg text-white text-xl font-bold cursor-pointer block mt-4"
            type="submit"
            value="Crear Proyecto"
          />
        </div>
      </form>
    </>
  );
}
