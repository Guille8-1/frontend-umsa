import { useState } from "react";
import { motion } from "framer-motion";
import { useActionState, useEffect } from "react";
import { createCommentActivity } from "@/actions/create-comment-activity-action";
import { toast } from "react-toastify";
import { setValue } from "@/src/Store";
import { useDispatch } from "react-redux";
import sanitizeHtml from "sanitize-html";
import { type userOptions } from "@/components/projects/CreateProjectForm";
import { CommentsActivity, ActivityTypes, GetUserType } from "@/src/schemas";
import { IoClose } from "react-icons/io5";
import Select, { MultiValue } from "react-select";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { updateActivityAssigned } from "@/actions/update-user-activity-action";
import { updateActivity } from "@/actions/update-activity-action";
import { Oval } from 'react-loader-spinner';
import { colorValueProgress, stringPriority, stringStatus } from "@/components/projects/project-table/tableLogic";

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

type fetchActForm = {
  estado: string,
  avance: number,
  prioridad: string,
  fetched: boolean
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
  const assActvity: string = data?.asignadosActividad.join(", ") ?? '';
  const [assAct, setAssAct] = useState<string>('');

  const updateBody: fetchActForm = {
    estado: data?.estadoActividad ?? '',
    avance: data?.avanceActividad ?? 0,
    prioridad: data?.prioridadActividad ?? '',
    fetched: true
  }
  const [loadAss, setLoadAss] = useState<boolean>(true);
  const [body, setBody] = useState<fetchActForm>(updateBody);

  useEffect(() => {
    setAssAct(assActvity);
    setBody(updateBody);
  }, [data])

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
    setTimeout(() => {
      fetchDispatch(setValue("changed"));
    }, 1200);
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
    if (actAssign) {
      setActAssign(false);
    }
  };

  const [users, setUsers] = useState<GetUserType>([]);
  const [selectEditUser, setSelectEditUser] = useState<userOptions[] | null>(
    [],
  );
  const userEditOptions: userOptions[] = [];

  const addingEditUser = (userEdit: MultiValue<userOptions>) => {
    setSelectEditUser([...userEdit]);
  };

  const userActIds: number[] = [];
  const gettinId = selectEditUser ?? [];

  gettinId.map((userId) => {
    const { id } = userId;
    userActIds.push(id);
  });

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
  }, [secret, token]);

  for (const userEdit of users) {
    const { nombre, apellido } = userEdit;
    const label = `${nombre} ${apellido}`;
    const value = `${nombre} ${apellido}`.toLowerCase();
    const id = userEdit.id;

    userEditOptions.push({ label, value, id });
  }

  const [assignState, assigDispatch] = useActionState(updateActivityAssigned, {
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
      setActAssign(false);
      setLoadAss(false);
      setSelectEditUser([]);

      toast.success(assignState.success);
      const refetchModalAct = async () => {
        const url: string = `${secret}/actividades/newusers/${data?.id}`
        const request = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const newUsers = await request.json()
        setAssAct(newUsers);
        setLoadAss(true)
      }
      setTimeout(() => {
        refetchModalAct();
      }, 1200)
    }
  }, [assignState]);

  const [editActState, editActDispatch] = useActionState(updateActivity, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (editActState.errors) {
      editActState.errors.forEach((error: string) => {
        toast.error(error);
      });
    }
  }, [editActState]);

  useEffect(() => {
    if (editActState.success) {
      setBodyEdit(false);
      toast.success(editActState.success);
      setBody({
        estado: '',
        avance: 0,
        prioridad: '',
        fetched: false
      })

      const newDataBody = async () => {
        const url: string = `${secret}/actividades/edited/${data?.id}`
        const request = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const newBody: fetchActForm = await request.json();

        setBody({
          estado: newBody.estado,
          avance: newBody.avance,
          prioridad: newBody.prioridad,
          fetched: true
        })
      }

      setTimeout(() => {
        newDataBody()
      }, 1200)
    }
  }, [editActState]);

  const colorValue = data?.avanceActividad ?? 0;
  const returnedColor = colorValueProgress(colorValue);
  const priorityReturnedColor = data?.prioridadActividad ?? '';
  const returnedPriorityColor = stringPriority(priorityReturnedColor);
  const statusValue = data?.estadoActividad ?? '';
  const colorStatus = stringStatus(statusValue);
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
                {/*forma para cambiar los Asignados */}
                <form noValidate action={assigDispatch}>
                  <section className="bg-gray-200 rounded-2xl px-4 py-2 flex flex-row gap-10 shadow-lg justify-between p-2 w-full">
                    <section className="flex flexflex-row gap-10">
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
                        <input
                          type="text"
                          className={"hidden"}
                          defaultValue={data.id}
                          name="idActivity"
                        />
                        <input
                          type="text"
                          className={"hidden"}
                          defaultValue={data.user.id}
                          name="userActId"
                        />
                        <p className="mt-2"> {data.gestorActividad}</p>
                        {actAssign ? (
                          <>
                            <Select
                              name="userActEdit"
                              options={userEditOptions}
                              value={selectEditUser}
                              onChange={addingEditUser}
                              isMulti={true}
                              isSearchable={true}
                              placeholder={"Seleccionar"}
                              className="cursor-pointer mt-1"
                            />
                            <input
                              type="text"
                              className="hidden"
                              name="userActEditId"
                              defaultValue={userActIds.toLocaleString()}
                            />
                          </>
                        ) : (
                          <>
                            <div className="mt-2 text-sky-800 font-bold">
                              {loadAss ? assAct : <Oval width={'20'} height={'20'} color="#075985" />}
                            </div>
                          </>
                        )}
                      </div>
                    </section>
                    {nivel != 4 ? (
                      <div className="mt-1">
                        {actAssign ? (
                          <>
                            <div className="flex flex-row gap-2 items-center">
                              <button
                                type="submit"
                                onClick={dispatchFunction}
                                className="flex flex-row gap-2 bg-sky-800 rounded-xl px-2 py-1 text-white items-center font-semibold"
                              >
                                Reasignar{" "}
                              </button>
                              <button
                                className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded-xl font-semibold"
                                onClick={() => {
                                  changeAssinged();
                                }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                changeAssinged();
                              }}
                              className="flex flex-row gap-2 bg-sky-800 rounded-lg px-2 py-1 text-white"
                            >
                              Editar
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
                    <form noValidate action={editActDispatch}>
                      <input
                        type="text"
                        defaultValue={data.id}
                        name="idActivity"
                        className="hidden"
                      />
                      <input
                        type="text"
                        defaultValue={data.user.id}
                        name="idUser"
                        className="hidden"
                      />
                      <section className="text-base flex flex-col">
                        {bodyEdit ? (
                          <select
                            id={"estado"}
                            className={"mt-[12px] rounded-sm px-1 bg-white"}
                            name={"estadoActEdit"}
                          >
                            <option value="" defaultChecked>
                              Seleccionar
                            </option>
                            <option value="Activo">Activo</option>
                            <option value="Cerrado">Cerrado</option>
                          </select>
                        ) : (
                          <div className="mt-2 flex flex-row gap-4 font-bold" style={{ color: colorStatus }}>{body.fetched ? body.estado : <Oval width={'20'} height={'20'} color="#075985" />}</div>
                        )}
                        {bodyEdit ? (
                          <select
                            id={"avance"}
                            className={"w-auto rounded-sm px-1 bg-white mt-2"}
                            name="avanceActEdit"
                          >
                            <option value="" defaultChecked>
                              Seleccionar
                            </option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                            <option value="60">60</option>
                            <option value="70">70</option>
                            <option value="80">80</option>
                            <option value="90">90</option>
                            <option value="100">100</option>
                            <option value="completado">Completado</option>
                          </select>
                        ) : (
                          <div className="mt-2 flex flex-row gap-4 font-extrabold" style={{ color: returnedColor }}>{body.fetched ? body.avance : <Oval width={'20'} height={'20'} color="#075985" />} %</div>
                        )}
                        <p className="mt-2">{data.diasActivoActividad}</p>
                        {bodyEdit ? (
                          <select
                            id={"avance"}
                            className={"w-auto rounded-sm px-1 bg-white mt-2"}
                            name="prioridadAct"
                          >
                            <option value="Urgente">Urgente</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                          </select>
                        ) : (
                          <div className="mt-2 font-bold" style={{ color: returnedPriorityColor }}>{body.fetched ? body.prioridad : <Oval width={'20'} height={'20'} color="#075985" />}</div>
                        )}
                        <div className="mt-2 flex flex-row gap-4">{data.oficinaOrigenActividad} </div>
                        <p className="mt-2">
                          {data.categoriaActividad ?? "Sin Categoria"}
                        </p>
                        <p className="mt-2 font-bold">
                          {lastUpdated?.fechaCreacion ?? formattedDate}
                        </p>
                        {nivel != 4 ? (
                          <section className="flex flex-row mt-2 gap-5 items-center ml-0">
                            {bodyEdit ? (
                              <>
                                <button
                                  type="submit"
                                  className="rounded-lg px-2 py-1 text-white bg-sky-800 mt-2"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={switchEdit}
                                  className="bg-red-500 font-bold text-white mt-2 rounded-lg px-2 py-1"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  switchEdit();
                                }}
                                className="rounded-lg px-2 py-1 text-white bg-sky-800 mt-2"
                              >
                                Editar
                              </button>
                            )}
                          </section>
                        ) : (
                          <></>
                        )}
                      </section>
                    </form>
                  </section>
                </section>
              </div>

              <div className="w-full h-[2px] bg-gray-400 mt-4" />
              <div
                key={state.success}
                className="mt-5 flex flex-col gap-3 p-4 rounded-2xl bg-slate-300"
              >
                <div className="flex flex-col">
                  <h2 className="text-[16px]">
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
                            className="text-[16px]"
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
                  <p className="font-bold">Aun no Existen Comentarios</p>
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
