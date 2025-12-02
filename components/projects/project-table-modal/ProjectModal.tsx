import { useActionState, useEffect, useState, useRef } from "react";
import Select, { MultiValue } from "react-select";
import { motion } from "framer-motion";
import { ProjectTypes, Comments, GetUsersSchema } from "@/src/schemas";
import { createComment } from "@/actions/create-comment-action";
import { toast } from "react-toastify";
import { setValue } from "@/src/Store";
import { useDispatch } from "react-redux";
import sanitizeHtml from "sanitize-html";
import { IoClose } from "react-icons/io5";
import { GetUserType, User } from "@/src/schemas";

import { type userOptions } from "@/components/projects/CreateProjectForm";
import { updateProject } from "@/actions/update-project-action";
import { updateAssigned } from "@/actions/update-user-project-action";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

interface UserProjectModalProps {
  data: ProjectTypes | null;
  comments: Comments | null;
  user: User;
  token: string;
  url: string;
  onClose: () => void;
  goPrevious: () => void;
  goNext: () => void;
}

export function ProjectModal({
  data,
  comments,
  user,
  url,
  token,
  onClose,
  goNext,
  goPrevious,
}: UserProjectModalProps) {
  const createdDate: string | null | undefined = data?.createdDate;

  const created = new Date(createdDate ?? new Date());
  const formattedDate = created.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newComment = comments ?? [];
  const newCommnets = newComment.map((comment) => ({
    id: comment.id,
    autor: comment.author ?? "Sin Autor ",
    comments: comment.comentario ?? "Sin Comentarios",
    fechaCreacion: new Date(comment.createdDate ?? new Date()).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    ),
    fechaActualizada: new Date(
      comment.updatedDate ?? new Date(),
    ).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const linkfy = (comment: string): string => {
    const urlRegex =
      /((https?:\/\/)?(www\.)?[\w-]+\.[a-z]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?)/gi;
    return comment.replace(urlRegex, (url) => {
      const href = url.startsWith("http") ? url : `https://${url}`;
      return `<a href="${href}" target="_blank" class="text-blue-500 underline">${url}</a>`;
    });
  };

  const links = (textComment: string): string => {
    const raw = linkfy(textComment);
    return sanitizeHtml(raw, {
      allowedTags: ["a"],
      allowedAttributes: {
        a: ["href", "target", "class"],
      },
    });
  };

  const sortedComments = [...newCommnets].sort((a, b) => b.id - a.id);

  const lastUpdated = [...newCommnets].reduce(
    (maxId, objId) => (objId.id > maxId.id ? objId : maxId),
    newCommnets[0],
  );

  const [state, dispatch] = useActionState(createComment, {
    errors: [],
    success: "",
  });
  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error: string) => {
        toast.error(error);
      });
    }
  }, [state]);

  useEffect(() => {
    if (state.success) {
      toast.success(state.success);
    }
  }, [state]);

  const fetchDispatch = useDispatch();

  const [k, setK] = useState<number>(0);
  const update = useRef<HTMLButtonElement>(null);

  const dispatchFunction = () => {
    setTimeout(() => {
      update.current?.click();
      fetchDispatch(setValue("changed"));
    }, 800);
  };

  const [edit, setEdit] = useState<boolean>(false);
  const [asignadosEdit, setAsignadosEdit] = useState<boolean>(false);

  const editValue = () => {
    setEdit(true);
    edit ? setEdit(false) : "";
  };
  const asignedEditValue = () => {
    setAsignadosEdit(true);
    asignadosEdit ? setAsignadosEdit(false) : "";
  };

  const [users, setUsers] = useState<GetUserType>([]);
  const [slctEditUser, setSlctEditUser] = useState<userOptions[] | null>([]);
  const userEditOptions: userOptions[] = [];

  const addingEditUser = (userEdit: MultiValue<userOptions>) => {
    setSlctEditUser([...userEdit]);
  };
  const newAssiged: userOptions[] | null = [...(slctEditUser ?? [])];
  let liveUsers: string | undefined;

  for (const name of newAssiged) {
    const { label } = name;
    liveUsers += `${label}, `;
  }

  const userIds: number [] = [];
  const gettingId = slctEditUser ?? [];

  gettingId.map(userId => {
    const { id } = userId;
    userIds.push(id)
  })

  useEffect(() => {
    const usersFetching = async () => {
      const fetchUrl: string = `${url}/users/assigned`;
      const request = await fetch(fetchUrl, {
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      const users = await request.json()
      setUsers(users)
    }
    usersFetching();
  }, []);

  for (const userEdit of users) {
    const { nombre, apellido } = userEdit;
    const label = `${nombre} ${apellido}`;
    const value = `${nombre} ${apellido}`.toLowerCase();
    const { id } = userEdit
    userEditOptions.push({ label, value, id });
  }

  //funcion para la forma general de edicion proyecto

  const [editState, editDispatch] = useActionState(updateProject, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (editState.errors) {
      editState.errors.forEach((error: string) => {
        toast.error(error);
      });
    }
  }, [editState]);

  useEffect(() => {
    if (editState.success) {
      toast.success(editState.success);
    }
  }, [editState, edit]);

  const [assignState, assigDispatch] = useActionState(updateAssigned, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (assignState.errors) {
      assignState.errors.forEach((error: string) => {
        toast.error(error);
      });
    }
  }, [assignState]);

  useEffect(() => {
    if (assignState.success) {
      toast.success(assignState.success);
      setAsignadosEdit(false);
      toast.info(
        "Puede Tomar algunos minutos en verse los cambios en este menu de Proyecto",
      );
    }
  }, [assignState]);

  return (
    <>
      <section className="" id="governor">
        <button
          className="hiddem"
          onClick={() => setK(k + 1)}
          ref={update}
        ></button>
        {data && <div onClick={onClose} />}
        <section className="w-auto">
          <motion.aside
            initial={{ x: "250%" }}
            animate={{ x: data ? "0%" : "100%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={
              "fixed right-0 top-0 h-full w-[650px] bg-gray-100 z-50 p-4 border-l-2 rounded-lg border-gray-400 shadow-[-8px_4px_30px_rgba(0,0,0,0.25)] overflow-auto"
            }
          >
            {data ? (
              <section className="w-full">
                <div className="mx-auto w-full rounded-2xl px-5 mt-2 items-center p-1 flex flex-row gap-8">
                  <div
                    className={
                      "flex flex-row items-center justify-between gap-4 w-full"
                    }
                  >
                    <div
                      onClick={goPrevious}
                      className="rounded-xl bg-sky-700 p-2 cursor-pointer flex flex-col gap-2 w-22"
                    >
                      <button className="flex flex-col items-center">
                        <GrPrevious size={"1.3rem"} color="#fff" />
                      </button>
                      <p className="text-white font-bold">Anterior</p>
                    </div>
                    <div
                      className={
                        "flex flex-col gap-2 items-center bg-gray-300 border-2 border-gray-300 shadow-lg py-1 px-3 rounded-xl justify-center"
                      }
                    >
                      <h2 className={"font-bold"}>
                        PROYECTO Id:{" "}
                        <span className="font-bold text-blue-500">
                          {data.id}
                        </span>
                      </h2>
                      <h1 className="text-center text-sky-800 rounded-2xl font-extrabold text-[15px]">
                        {data.titulo.toUpperCase()}
                      </h1>
                    </div>
                    <div
                      onClick={goNext}
                      className="rounded-xl bg-green-700 p-2 cursor-pointer flex flex-col gap-2 w-22"
                    >
                      <button className="flex flex-col items-center">
                        <GrNext size={"1.3rem"} color="#fff" />
                      </button>
                      <p className="text-white font-bold">Siguiente</p>
                    </div>
                  </div>
                  <button
                    className="text-xl p-3 font-light flex align- rounded-2xl bg-gray-300"
                    onClick={onClose}
                  >
                    {" "}
                    <IoClose size="1.5em" color={"#B51300"} />
                  </button>
                </div>
                <div className="flex flex-row gap-4"></div>
                <div className={"w-full h-[2px] bg-gray-400 mx-auto my-4"} />
                <section className="flex flex-row mx-2 gap-3 my-3 bg-[#D8E1E8] p-3 pr-4 rounded-lg items-center justify-between">
                  <form
                    noValidate
                    action={assigDispatch}
                    className="flex flex-row items-center justify-between  w-full"
                  >
                    <section className="flex flex-row mx-2 gap-3 items-center">
                      <section>
                        <p className="font-bold">Asignados:</p>
                      </section>
                      <input
                        type="text"
                        className={"hidden"}
                        defaultValue={data.id}
                        name="idProject"
                      />
                      <input
                        type="text"
                        className={"hidden"}
                        defaultValue={data.user.id}
                        name="userId"
                      />
                      <section>
                        {asignadosEdit ? (
                          <Select
                            name="usersEdit"
                            options={userEditOptions}
                            value={slctEditUser}
                            onChange={addingEditUser}
                            className="w-full border border-gray-300 p-3 rounded-lg"
                            placeholder="Asignar Usuarios"
                            isMulti={true}
                            isSearchable={true}
                            key={k}
                          />
                        ) : (
                          <p key={k} className="font-bold text-sky-800  ">
                            {data.asignados.join(", ")}
                          </p>
                        )}
                      </section>
                      <input type="text" className="hidden" name="editUserId" defaultValue={userIds.toLocaleString()}/>
                    </section>
                    {asignadosEdit ? (
                      <section className="flex flex-row gap-3">
                        <input
                          onClick={dispatchFunction}
                          type="submit"
                          className="bg-sky-600 text-white px-2 p-1 rounded-md cursor-pointer"
                          value={"Guardar"}
                        />
                        <button
                          onClick={asignedEditValue}
                          className="bg-red-700 text-white px-2 p-1 rounded-md"
                        >
                          Cancelar
                        </button>
                      </section>
                    ) : (
                      <></>
                    )}
                  </form>
                  {asignadosEdit ? (
                    <></>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          asignedEditValue();
                        }}
                        className="bg-sky-800 text-white px-2 p-1 rounded-md"
                      >
                        Reasignar
                      </button>
                    </>
                  )}
                </section>
                <form
                  className="flex flex-col items-top bg-[#D8E1E8] rounded-2xl justify-between items-center shadow-xl border-2 border-[#D8E1E8]"
                  action={editDispatch}
                >
                  <section className="pb-4 px-4 mt-2 w-full">
                    <section className={"w-full mx-auto"}>
                      {/* Estado */}
                      {/* Body Form */}
                      <section
                        className={"flex flex-row mt-2 gap-10 items-center"}
                      >
                        <div className={""}>
                          <p className="mt-2">
                            {" "}
                            <strong>Estado : </strong>{" "}
                          </p>
                        </div>
                        <input
                          type="text"
                          className={"hidden"}
                          defaultValue={data.id}
                          name="idProject"
                        />
                        <div className={"ml-12"}>
                          {edit ? (
                            <select
                              id={"estado"}
                              className={"mt-[10px] rounded-sm px-1 bg-white"}
                              name={"estadoEdit"}
                            >
                              <option value="" defaultChecked>
                                Seleccionar
                              </option>
                              <option value="activo">Activo</option>
                              <option value="cerrado">Cerrado</option>
                            </select>
                          ) : (
                            <p className="mt-2">{data.estado}</p>
                          )}
                        </div>
                      </section>
                      {/* Avance */}
                      <section
                        className={"flex flex-row mt-2 gap-10 items-center"}
                      >
                        <div className={""}>
                          <p className="">
                            {" "}
                            <strong>Avance : </strong>
                          </p>
                        </div>
                        <div className={"ml-12"}>
                          {edit ? (
                            <select
                              id={"avance"}
                              className={"w-auto rounded-sm px-1 bg-white"}
                              name="avanceEdit"
                            >
                              <option value="" defaultChecked>
                                Seleccionar
                              </option>
                              <option value="20">20</option>
                              <option value="40">40</option>
                              <option value="60">60</option>
                              <option value="80">80</option>
                              <option value="90">90</option>
                              <option value="completado">Completado</option>
                            </select>
                          ) : (
                            <p className="">{data.avance} %</p>
                          )}
                        </div>
                      </section>
                      {/* Dias Activo */}
                      <section className={"flex flex-row gap-4"}>
                        <div className={""}>
                          <p className="mt-2">
                            {" "}
                            <strong>Dias Activo : </strong>
                          </p>
                        </div>
                        <div className={"ml-10"}>
                          <p className="mt-2">{data.diasActivo}</p>
                        </div>
                      </section>
                      {/* Ruta Cv */}
                      <section className={"flex flex-row gap-10"}>
                        <div className={"m-0"}>
                          <p className="mt-2">
                            {" "}
                            <strong>Ruta CV: </strong>
                          </p>
                        </div>
                        <div className={"w-auto ml-10"}>
                          <p className="mt-2">{data.rutaCv}</p>
                        </div>
                      </section>
                      {/* Numero Cite */}
                      <section className={"flex flex-row"}>
                        <div>
                          <p className="mt-2">
                            {" "}
                            <strong>Numero CITE : </strong>
                          </p>
                        </div>
                        <div className={"ml-10"}>
                          <p className="mt-2">{data.citeNumero}</p>
                        </div>
                      </section>
                      {/* Tipo Documento */}
                      <section className={"flex flex-row"}>
                        <div>
                          <p className="mt-2">
                            {" "}
                            <strong>
                              Documento o<br /> Actividad :{" "}
                            </strong>
                          </p>
                        </div>
                        <div className={"ml-12"}>
                          {edit ? (
                            <input
                              defaultValue={data.tipoDocumento}
                              type={"text"}
                              min={15}
                              max={100}
                              className={
                                "rounded-sm px-1 bg-white w-auto h-auto mt-[10px]"
                              }
                              name="documentoEdit"
                            />
                          ) : (
                            <p className="mt-2">{data.tipoDocumento}</p>
                          )}
                        </div>
                      </section>
                      {/* Prioridad */}
                      <section className={"flex flex-row"}>
                        <div>
                          <p className="mt-2">
                            {" "}
                            <strong>Prioridad : </strong>
                          </p>
                        </div>
                        <div className={"ml-[75px]"}>
                          {edit ? (
                            <select
                              id={"prioridad"}
                              className={
                                "w-auto mt-[10px] rounded-sm px-1 bg-white"
                              }
                              name="prioridadEdit"
                            >
                              <option value="" defaultChecked>
                                Seleccionar
                              </option>
                              <option value="urgente">Urgente</option>
                              <option value="media">Media</option>
                              <option value="baja">Baja</option>
                            </select>
                          ) : (
                            <p className="mt-2">{data.prioridad}</p>
                          )}
                        </div>
                      </section>

                      {/* Ofinica Origen */}
                      <section className={"flex flex-row"}>
                        <div>
                          <p className="mt-2">
                            {" "}
                            <strong>Oficina de Origen : </strong>
                          </p>
                        </div>
                        <div className={"ml-6"}>
                          <p className="mt-2">{data.oficinaOrigen}</p>
                        </div>
                      </section>
                      {/* Ultima Act */}
                      <section className={"flex flex-row"}>
                        <div>
                          <p className="mt-2">
                            {" "}
                            <strong>Ultima Actualizacion : </strong>
                          </p>
                        </div>
                        <div className={"ml-6"}>
                          <p className="mt-2">
                            {lastUpdated?.fechaCreacion ?? formattedDate}
                          </p>
                        </div>
                      </section>
                      {/*Aqui tendria que ir el form del resto del proyecto*/}
                      {user.nivel != 4 ? (
                        <section className={"my-4"}>
                          {edit ? (
                            <section
                              className={
                                "flex flex-row items-center gap-8 text-lg"
                              }
                            >
                              <button
                                type="submit"
                                onClick={dispatchFunction}
                                className={
                                  "flex flex-row items-center bg-sky-700 text-white p-1 rounded-md px-3"
                                }
                              >
                                Guardar
                              </button>
                            </section>
                          ) : (
                            <></>
                          )}
                        </section>
                      ) : (
                        <></>
                      )}
                    </section>
                  </section>
                </form>
                {edit && user.nivel != 4 ? (
                  <section className={"flex flex-row items-center gap-2 mt-4"}>
                    <button
                      onClick={editValue}
                      className={
                        "font-semibold bg-red-700 text-white p-1 px-4 rounded-lg"
                      }
                    >
                      Cancelar
                    </button>
                  </section>
                ) : (
                  <section className={"flex flex-row items-center gap-2 mt-4"}>
                    <button
                      onClick={editValue}
                      className={
                        "flex bg-sky-800 rounded-lg p-1 px-3 font-semibold text-white"
                      }
                    >
                      Editar
                    </button>
                  </section>
                )}
                {/* Comentarios*/}
                <div className={"w-full h-[2px] bg-gray-400 mx-auto mt-6"} />
                <div
                  key={state.success}
                  className=" flex flex-col gap-3 mt-2 bg-gray-100 rounded-2xl"
                >
                  <div className="flex flex-col">
                    <h2>
                      <strong>Comentarios Proyecto : </strong>
                    </h2>
                  </div>
                  {newComment.length > 0 ? (
                    sortedComments.map((comment, index) => (
                      <div
                        key={comment.id ?? index}
                        className="w-full border-2 rounded-2xl border-gray-200 bg-gray-200 mt-2"
                      >
                        <section className="rounded-2xl shadow-xl p-3 break-all">
                          <p className="text-sm font-medium">
                            <strong>{comment.autor}</strong>
                          </p>
                          <section className={"mt-2"}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: links(comment.comments),
                              }}
                            />
                          </section>
                          <section className="flex place-content-end mt-3 font-thin">
                            <p className="text-sm font-medium">
                              <strong>{comment.fechaCreacion}</strong>
                            </p>
                          </section>
                        </section>
                      </div>
                    ))
                  ) : (
                    <p>Aun No existen Comentarios en Este Proyecto</p>
                  )}
                </div>
                <section className="w-full">
                  <form
                    noValidate
                    className="w-full  mt-4 p-4 border rounded-xl shadow bg-white flex flex-col items-end"
                    action={dispatch}
                  >
                    <textarea
                      className="border-2 border-solid p-2 w-full"
                      name="comentario"
                      id="comentario"
                      placeholder="Escribe un Comentario"
                      rows={4}
                    ></textarea>
                    <div className="hidden">
                      <label htmlFor="comentario"></label>
                      <input
                        type="numero"
                        id="comentario"
                        name="projectId"
                        value={data.id}
                        readOnly={true}
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={dispatchFunction}
                      className="mt-4 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition w-3/12"
                    >
                      Comentar
                    </button>
                  </form>
                </section>
              </section>
            ) : null}
          </motion.aside>
        </section>
      </section>
    </>
  );
}
