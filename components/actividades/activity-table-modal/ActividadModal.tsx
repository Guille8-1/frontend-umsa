import { useState } from "react";
import { motion } from "framer-motion";
import { CommentsActivity, ActivityTypes, GetUserType } from "@/src/schemas";
import { useActionState, useEffect } from "react";
import { createCommentActivity } from "@/actions/create-comment-activity-action";
import { toast } from "react-toastify";
import { setValue } from "@/src/Store";
import { useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import sanitizeHtml from "sanitize-html";
import { type userOptions } from "@/components/projects/CreateProjectForm";
import Select, { MultiValue } from "react-select";
import { FaEdit } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

interface UserProjectModalProps {
  data: ActivityTypes | null;
  comments: CommentsActivity | null;
  onClose: () => void;
  nivel: number;
  goPrevious: () => void;
  goNext: () => void;
  token: string;
  secret: string;
}

export function ActividadModal({
  data,
  comments,
  nivel,
  onClose,
  goNext,
  goPrevious,
  token,
  secret,
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
    comentario: comment.comentario ?? "Sin Comentarios",
    autor: comment.author ?? "Sin Autor ",
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

  const [state, dispatch] = useActionState(createCommentActivity, {
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
  const dispatchFunction = () => {
    fetchDispatch(setValue("changed"));
  };

  const [bodyEdit, setBodyEdit] = useState<boolean>(false);

  const switchEdit = () => {
    setBodyEdit(true);
    if (bodyEdit) {
      setBodyEdit(false);
    }
  };

  const [actAssign, setActAssign] = useState<boolean>(false);
  const changeAssinged = () => {
    setActAssign(true);
    actAssign ? setActAssign(false) : "";
  };

  const [users, setUsers] = useState<GetUserType>([]);
  const [selectEditUser, setSelectEditUser] = useState<userOptions[] | null>(
    [],
  );
  const userEditOptions: userOptions[] = [];

  const addingEditUser = (userEdit: MultiValue<userOptions>) => {
    setSelectEditUser([...userEdit]);
  };

  useEffect(() => {
    const callingUsers = async (token: string, secret: string) => {
      const url: string = `${secret}/users/assigned`;
      const request = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await request.json();
      setUsers(userData);
    };
    callingUsers(token, secret);
  }, []);

  for (const userEdit of users) {
    const { nombre, apellido } = userEdit;
    const label = `${nombre} ${apellido}`;
    const value = `${nombre} ${apellido}`.toLowerCase();
    userEditOptions.push({ label, value });
  }

  return (
    <>
      {data && <div onClick={onClose} />}
      <section className="w-auto">
        <motion.aside
          initial={{ x: "1000%" }}
          animate={{ x: data ? "0%" : "100%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed right-0 top-0 h-full w-[650px] bg-gray-100 z-50 p-4 border-l-2 rounded-lg border-gray-400 shadow-[-8px_4px_30px_rgba(0,0,0,0.25)] overflow-auto"
        >
          {data ? (
            <section className="w-full">
              <section className="mx-auto w-full rounded-2xl px-5 mt-2 items-center p-1 flex flex-row gap-8">
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                  <section
                    onClick={goPrevious}
                    className="rounded-xl bg-sky-700 p-2 cursor-pointer flex flex-col gap-2 w-22"
                  >
                    <button className="flex flex-col items-center">
                      <GrPrevious size={"1.3rem"} color="#fff" />
                    </button>
                    <p className="text-white font-bold">Anterior</p>
                  </section>
                  <div className="flex flex-col gap-2 items-center bg-gray-300 border-2 border-gray-300 shadow-lg py-1 px-3 rounded-xl justify-center">
                    <h2 className="font-semibold">
                      Proyecto:
                      <span className="font-bold">{` ${data.id}`}</span>
                    </h2>
                    <h1 className="font-semibold text-center text-lg text-sky-800 rounded-2xl">
                      {data.tituloActividad.toUpperCase()}
                    </h1>
                  </div>
                  <section
                    onClick={goNext}
                    className="rounded-xl bg-green-700 p-2 cursor-pointer flex flex-col gap-2 w-22"
                  >
                    <button className="flex flex-col items-center">
                      <GrNext size={"1.3rem"} color="#fff" />
                    </button>
                    <p className="text-white font-bold">Anterior</p>
                  </section>
                </div>
                <button
                  className="text-xl text-white px-2 py-3 font-light flex align-middle items-center rounded-2xl bg-gray-300 w-12 h-14"
                  onClick={onClose}
                >
                  {" "}
                  <IoClose color="#A62121" size="1.5em" />
                </button>
              </section>

              <div className="w-full h-[2px] bg-gray-400 mt-4" />
              <div className="mt-2 flex flex-col w-auto p-4 rounded-2xl bg-slate-400">
                <form action="">
                  <section className="bg-gray-200 rounded-2xl px-4 py-2 flex flex-row gap-10 shadow-lg">
                    <div>
                      <p className="mt-2">
                        {" "}
                        <strong>Gestor </strong>
                      </p>
                      <p className="mt-2">
                        {" "}
                        <strong>Asignados </strong>
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="mt-2"> {data.gestorActividad}</p>
                      {actAssign ? (
                        <>
                          <Select
                            name="actUsers"
                            options={userEditOptions}
                            value={selectEditUser}
                            onChange={addingEditUser}
                            isMulti={true}
                            isSearchable={true}
                            placeholder={"Seleccionar"}
                            className="cursor-pointer mt-1"
                          />
                        </>
                      ) : (
                        <>
                          <p className="mt-2 text-sky-800 font-bold">
                            {data.asignadosActividad.join(", ")}
                          </p>
                        </>
                      )}
                    </div>
                    {nivel != 4 ? (
                      <div className="mt-1">
                        {actAssign ? (
                          <>
                            <div className="flex flex-row gap-2 items-center">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log(
                                    "sending info to change the act with user data recording",
                                  );
                                }}
                                className="flex flex-row gap-2 bg-sky-800 rounded-2xl px-2 py-1 text-white items-center"
                              >
                                Reasignar
                                <FaSave size={"1em"} />
                              </button>
                              <p
                                className="text-red-500 font-bold cursor-pointer"
                                onClick={()=>{
                                  changeAssinged()
                                  console.log('testing')
                                }}
                              >
                                Cancelar
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                changeAssinged();
                              }}
                              className="flex flex-row gap-2 bg-sky-800 rounded-2xl px-2 py-1 text-white"
                            >
                              <p>Editar Asingados</p>
                              <FaEdit size={"1.2em"} />
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <></>
                    )}
                  </section>
                </form>
                <section className=" bg-gray-200 px-4 py-2 rounded-2xl mt-6 shadow-lg">
                  <section className="flex flex-row gap-10">
                    <section className="text-base">
                      <p className="mt-2">
                        {" "}
                        <strong>Estado : </strong>{" "}
                      </p>
                      <p className="mt-2">
                        {" "}
                        <strong>Avance : </strong>
                      </p>
                      <p className="mt-2">
                        {" "}
                        <strong>Dias Activo : </strong>
                      </p>
                      <p className="mt-2">
                        {" "}
                        <strong>Prioridad : </strong>
                      </p>
                      <p className="mt-2">
                        {" "}
                        <strong>Oficina de Origen : </strong>
                      </p>
                      <p className="mt-2">
                        {" "}
                        <strong>Categoria Actividad : </strong>
                      </p>
                      <p className="mt-2">
                        {" "}
                        <strong>Ultima Actualizacion : </strong>
                      </p>
                    </section>
                    <form action="">
                      <section className="text-base flex flex-col">
                        {bodyEdit ? (
                          <select
                            id={"estado"}
                            className={"mt-[12px] rounded-sm px-1 bg-white"}
                            name={"estadoEdit"}
                          >
                            <option value="" defaultChecked>
                              Seleccionar
                            </option>
                            <option value="activo">Activo</option>
                            <option value="cerrado">Cerrado</option>
                          </select>
                        ) : (
                          <p className="mt-2">{data.estadoActividad}</p>
                        )}
                        {bodyEdit ? (
                          <select
                            id={"avance"}
                            className={"w-auto rounded-sm px-1 bg-white mt-2"}
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
                          <p className="mt-2">{data.avanceActividad} %</p>
                        )}
                        <p className="mt-2">{data.diasActivoActividad}</p>
                        {bodyEdit ? (
                          <select
                            id={"avance"}
                            className={"w-auto rounded-sm px-1 bg-white mt-2"}
                            name="avanceEdit"
                          >
                            <option value="urgente">Urgente</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                          </select>
                        ) : (
                          <p className="mt-2">{data.prioridadActividad}</p>
                        )}
                        <p className="mt-2">{data.oficinaOrigenActividad}</p>
                        <p className="mt-2">
                          {data.categoriaActividad ?? "Sin Categoria"}
                        </p>
                        <p className="mt-2">
                          {lastUpdated?.fechaCreacion ?? formattedDate}
                        </p>
                      </section>
                    </form>
                  </section>
                  {nivel != 4 ? (
                    <section>
                      {bodyEdit ? (
                        <section className="flex flex-row mt-2 gap-5">
                          <button
                            onClick={() => {
                              console.log("sending edit activity data");
                            }}
                            className="flex flex-row text-white bg-sky-800 p-2 rounded-lg"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={switchEdit}
                            className="text-red-400 font-bold"
                          >
                            cancelar
                          </button>
                        </section>
                      ) : (
                        <button
                          onClick={switchEdit}
                          className="rounded-lg p-2 text-white bg-sky-800 mt-2"
                        >
                          Editar
                        </button>
                      )}
                    </section>
                  ) : (
                    <></>
                  )}
                </section>
              </div>

              <div className="w-full h-[2px] bg-gray-400 mt-4" />
              <div
                key={state.success}
                className="mt-5 flex flex-col gap-3 p-4 rounded-2xl bg-slate-300"
              >
                <div className="flex flex-col">
                  <h2 className="text-[18px]">
                    <strong>Seguimiento: </strong>
                  </h2>
                </div>
                {newComment.length > 0 ? (
                  sortedComments.map((comment, index) => (
                    <div key={comment.id ?? index} className="w-full break-all">
                      <section className="border-4 rounded-2xl shadow-lg bg-gray-100 p-3 break-all">
                        <section className="break-all flex flex-col gap-2">
                          <p className="text-[18px] font-medium">
                            <strong>{comment.autor}</strong>
                          </p>
                          <div
                            className="text-[19px]"
                            dangerouslySetInnerHTML={{
                              __html: links(comment.comentario),
                            }}
                          />
                        </section>
                        <section className="flex place-content-end mt-3">
                          <p className="text-sm font-medium text-[16px]">
                            <strong>{comment.fechaCreacion}</strong>
                          </p>
                        </section>
                      </section>
                    </div>
                  ))
                ) : (
                  <p>Aun No existen Comentarios en Esta Actividad</p>
                )}
              </div>
              <section className="w-full">
                <form
                  noValidate
                  className="w-full mt-4 p-4 border rounded-xl shadow bg-white flex flex-col items-end"
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
    </>
  );
}
