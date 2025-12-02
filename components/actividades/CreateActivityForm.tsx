"use client";

import { useActionState, useEffect, useState } from "react";
import { createActivity } from "@/actions/create-activity-action";
import { GetUserType, User } from "@/src/schemas";
import { toast } from "react-toastify";
//react-select
import Select, { MultiValue } from "react-select";
//redux
import { useDispatch } from "react-redux";
import { setValue } from "@/src/Store";

type userOptions = {
  label: string;
  value: string;
  id: number
};

type apiTools = {
  token: string,
  secret: string
}

export default function ActivityForm({secret, token}:apiTools) {
  const [state, dispatch] = useActionState(createActivity, {
    errors: [],
    success: "",
  });

  const [users, setUsers] = useState<GetUserType>([]);
  const [selectedUsers, setSelectedUsers] = useState<userOptions[] | null>([]);

  const fetchDispatch = useDispatch();

  const dispatchFn = () => {
    fetchDispatch(setValue("changed"));
  };

  const userOptions: userOptions[] = [];

  const addingUsers = (userAdded: MultiValue<userOptions>) => {
    setSelectedUsers([...userAdded]);
  };

  const userIds: number [] = [];
  const gettingId = selectedUsers ?? [];

  gettingId.map(userId => {
    const { id } = userId;
    userIds.push(id)
  })

  useEffect(() => {
    const callingUsers = async (token: string, secret: string) => {
      const url: string = `${secret}/users/assigned`;
      const request = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const userData = await request.json()
      setUsers(userData);
    }
    callingUsers(token, secret);
  }, [])

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
    const value = `${nombre} ${apellido}`;
    const id = user.id
    userOptions.push({ label, value, id });
  }

  return (
    <>
      <form className="mt-5 space-y-3 " noValidate action={dispatch}>
        <div className="flex flex-row gap-5 justify-center">
          <div className="w-3/4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="email">
                Titulo Actividad
              </label>
              <input
                id="titulo"
                name="tituloAct"
                type="text"
                placeholder="Titulo Proyecto"
                className="w-full border border-gray-300 p-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="font-bold text-lg mt-3"
                htmlFor="categoriaActividad"
              >
                Tipo Actividad
              </label>
              <select
                id="categoriaActividad"
                name="categoriaActividad"
                className="w-full border border-gray-300 p-3 rounded-lg"
              >
                <option value="" defaultChecked>
                  Seleccionar
                </option>
                <option value="servicio">Serivicio</option>
                <option value="regular">Regular</option>
              </select>
            </div>
            <div className="font-bold text-lg mt-3">
              <label className="font-bold text-lg mt-3" htmlFor="asigandos">
                Usuarios
              </label>
              <Select
                name="asignadosAct"
                options={userOptions}
                value={selectedUsers}
                onChange={addingUsers}
                className="w-full border border-gray-300 p-3 rounded-lg"
                placeholder="Asignar Usuarios"
                isMulti={true}
                isSearchable={true}
              />
            </div>
            <input type="text" name="ids" id="" className="hidden" defaultValue={userIds.toLocaleString()}/>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="estado">
                Estado
              </label>
              <select
                name="estadoAct"
                id="estado"
                className="w-full border border-gray-300 p-3 rounded-lg"
              >
                <option value="" defaultChecked>
                  Seleccionar
                </option>
                <option value="activo">Activo</option>
                <option value="pendiente">Pendiente</option>
                <option value="mora">En Mora</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="tipo">
                Tipo
              </label>
              <select
                name="tipoAct"
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
                Prioridad
              </label>
              <select
                name="proprodadActividad"
                id="prioridad"
                className="w-full border border-gray-300 p-3 rounded-lg"
              >
                <option value="" defaultChecked>
                  Seleccionar
                </option>
                <option value="urgente">Urgente</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-lg mt-3" htmlFor="email">
                Oficina de Origen
              </label>
              <input
                  id="oficinaOrigenAct"
                  type="text"
                  placeholder="Oficina de Origen"
                  className="w-full border border-gray-300 p-3 rounded-lg appearance-none"
                  name="oficinaOrigenAct"
              />
            </div>
          </div>

        </div>
        <input
          onClick={dispatchFn}
          className="bg-cyan-800 hover:bg-cyan-700 w-3/4 p-3 rounded-lg text-white text-xl font-bold cursor-pointer block mt-4 mx-auto"
          type="submit"
          value="Crear Actividad"
        />
      </form>
    </>
  );
}
