import { useActionState, useEffect, useState, useRef } from "react";
import Select, { MultiValue } from "react-select";
import { motion } from "framer-motion";
import { ProjectTypes, Comments } from "@/src/schemas";
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
import { stringPriority, stringStatus, colorValueProgress } from "../project-table/tableLogic";
import { Oval } from 'react-loader-spinner';

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

type prjBody = {
  estado: string,
  avance: number,
  tipoDocumento: string,
  prioridad: string,
  fetched: boolean
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

  const [loadAss, setLoadAss] = useState<boolean>(true);

  const updatePrjBody: prjBody = {
    estado: data?.estado ?? '',
    avance: data?.avance ?? 0,
    tipoDocumento: data?.tipoDocumento ?? '',
    prioridad: data?.prioridad ?? '',
    fetched: true
  }

  const [body, setBody] = useState<prjBody>(updatePrjBody);
  const [assProject, setAssProject] = useState<string>();
  const assigneesProject: string = data?.asignados.join(", ") ?? '';

  useEffect(() => {
    setAssProject(assigneesProject);
    setBody(updatePrjBody);
  }, [data]);

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
    if (edit) {
      setEdit(false);
    }
  };

  const asignedEditValue = () => {
    setAsignadosEdit(true);
    if (asignadosEdit) {
      setAsignadosEdit(false);
    }
  };

  const [users, setUsers] = useState<GetUserType>([]);
  const [slctEditUser, setSlctEditUser] = useState<userOptions[] | null>([]);
  const userEditOptions: userOptions[] = [];

  const addingEditUser = (userEdit: MultiValue<userOptions>) => {
    setSlctEditUser([...userEdit]);
  };

  const userIds: number[] = [];
  const gettingId = slctEditUser ?? [];

  gettingId.map((userId) => {
    const { id } = userId;
    userIds.push(id);
  });

  useEffect(() => {
    const usersFetching = async () => {
      const fetchUrl: string = `${url}/users/assigned`;
      const request = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const users = await request.json();
      setUsers(users);
    };
    usersFetching();
  }, [token, url]);

  for (const userEdit of users) {
    const { nombre, apellido } = userEdit;
    const label = `${nombre} ${apellido}`;
    const value = `${nombre} ${apellido}`.toLowerCase();
    const { id } = userEdit;
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
      toast.success(`Proyecto ${editState.success} Actualizado`);
      setEdit(false);
      setBody({
        estado: '',
        avance: 0,
        tipoDocumento: '',
        prioridad: '',
        fetched: false
      });
      const newPrjData = async () => {
        const fetchUrl = `${url}/projects/new/body/${data?.id}`
        const request = await fetch(fetchUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const newBodyRequested: prjBody = await request.json();
        setBody({
          estado: newBodyRequested.estado,
          avance: newBodyRequested.avance,
          tipoDocumento: newBodyRequested.tipoDocumento,
          prioridad: newBodyRequested.prioridad,
          fetched: true
        });
      }
      setTimeout(() => {
        newPrjData();
      }, 800)
    }
  }, [editState]);

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
      setLoadAss(false)
      setSlctEditUser([]);
      const newAssingeesPrj = async () => {
        const backendUrl: string = `${url}/projects/assigned/newusers/${data?.id}`;
        const request = await fetch(backendUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const newPrjAssignees = await request.json();
        setAssProject(newPrjAssignees);
        setLoadAss(true);
      }
      setTimeout(() => {
        newAssingeesPrj()
      }, 800)
    }
  }, [assignState]);

  const colorValue = data?.avance ?? 0;
  const returnedColor = colorValueProgress(colorValue);
  const priorityReturnedColor = data?.prioridad ?? '';
  const returnedPriorityColor = stringPriority(priorityReturnedColor);
  const statusValue = data?.estado ?? '';
  const colorStatus = stringStatus(statusValue);

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
                <section className="flex flex-col bg-gray-500 p-4 mt-4 rounded-xl">
                  <section className="flex flex-row gap-3 mb-3 bg-[#D8E1E8] pr-4 rounded-lg items-center justify-between">
                    <form
                      noValidate
                      action={assigDispatch}
                      className="flex flex-row items-center justify-between w-full"
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
                              className="w-full border border-gray-3005 p-2 rounded-lg"
                              placeholder="Asignar Usuarios"
                              isMulti={true}
                              isSearchable={true}
                              key={k}
                            />
                          ) : (
                            <div key={k} className="font-bold text-sky-800 p-4">
                              {loadAss ? assProject : <Oval width={'20'} height={'20'} color="#075985" />}
                            </div>
                          )}
                        </section>
                        <input
                          type="text"
                          className="hidden"
                          name="editUserId"
                          defaultValue={userIds.toLocaleString()}
                        />
                      </section>
                      {asignadosEdit ? (
                        <section className="flex flex-row gap-3">
                          <input
                            onClick={dispatchFunction}
                            type="submit"
                            className="bg-sky-600 text-white px-2 p-1 rounded-md cursor-pointer"
                            value={"Reasignar"}
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
                          onClick={asignedEditValue}
                          className="bg-sky-800 text-white px-2 p-1 rounded-md"
                        >
                          Reasignar
                        </button>
                      </>
                    )}
                  </section>
                  <section className="flex flex-row bg-[#D8E1E8] p-4 rounded-lg gap-4">
                    <section className="flex flex-col gap-2 w-auto h-auto">
                      <div>
                        <p className="">
                          {" "}
                          <strong>Estado : </strong>{" "}
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>Avance : </strong>
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>Dias Activo : </strong>
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>Ruta CV: </strong>
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>Numero CITE : </strong>
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>
                            Documento o Actividad :{" "}
                          </strong>
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>Prioridad : </strong>
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>Oficina de Origen : </strong>
                        </p>
                      </div>
                      <div>
                        <p className="">
                          {" "}
                          <strong>Ultima Actualizacion : </strong>
                        </p>
                      </div>
                    </section>

                    <form
                      className="flex flex-col items-top rounded-2xl justify-start w-auto"
                      action={editDispatch}
                    >
                      <section className="px-4 w-full">
                        <section className={"mx-auto flex flex-col gap-2"}>
                          {/* Estado */}
                          {/* Body Form */}
                          <section>
                            <input
                              type="text"
                              className={"hidden"}
                              defaultValue={data.id}
                              name="idProject"
                            />
                            <input
                              type="number"
                              className={"hidden"}
                              defaultValue={user.id}
                              name="idUser"
                            />
                            <div>
                              {edit ? (
                                <select
                                  id={"estado"}
                                  className={"rounded-sm px-1 bg-white"}
                                  name={"estadoEdit"}
                                >
                                  <option value="" defaultChecked disabled>
                                    Seleccionar
                                  </option>
                                  <option value="activo">Activo</option>
                                  <option value="cerrado">Cerrado</option>
                                </select>
                              ) : (
                                <div className="font-extrabold" style={{ color: colorStatus }}>{body.fetched ? body.estado : <Oval width={'20'} height={'20'} color="#075985" />}</div>
                              )}
                            </div>
                          </section>
                          {/* Avance */}
                          <section>
                            <div>
                              {edit ? (
                                <select
                                  id={"avance"}
                                  className={"w-auto rounded-sm px-1 bg-white"}
                                  name="avanceEdit"
                                >
                                  <option value="" defaultChecked disabled>
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
                                <div className="font-black" style={{ color: returnedColor }}>{body.fetched ? body.avance : <Oval width={'20'} height={'20'} color="#075985" />} %</div>
                              )}
                            </div>
                          </section>
                          {/* Dias Activo */}
                          <section>
                            <div>
                              <p className="">{data.diasActivo}</p>
                            </div>
                          </section>
                          {/* Ruta Cv */}
                          <section>
                            <div>
                              <p className="">{data.rutaCv}</p>
                            </div>
                          </section>
                          {/* Numero Cite */}
                          <section>
                            <div>
                              <p className="">{data.citeNumero}</p>
                            </div>
                          </section>
                          {/* Tipo Documento */}
                          <section className={"flex flex-row"}>
                            <div>
                              {edit ? (
                                <input
                                  defaultValue={data.tipoDocumento}
                                  type={"text"}
                                  min={15}
                                  max={100}
                                  className={
                                    "rounded-sm px-1 bg-white"
                                  }
                                  name="documentoEdit"
                                />
                              ) : (
                                <div className="">{body.fetched ? body.tipoDocumento : <Oval width={'20'} height={'20'} color="#075985" />}</div>
                              )}
                            </div>
                          </section>
                          {/* Prioridad */}
                          <section className={"flex flex-row"}>
                            <div>
                              {edit ? (
                                <select
                                  id={"prioridad"}
                                  className={
                                    "w-auto rounded-sm px-1 bg-white"
                                  }
                                  name="prioridadEdit"
                                >
                                  <option value="" defaultChecked disabled>
                                    Seleccionar
                                  </option>
                                  <option value="urgente">Urgente</option>
                                  <option value="media">Media</option>
                                  <option value="baja">Baja</option>
                                </select>
                              ) : (
                                <div className="font-extrabold" style={{ color: returnedPriorityColor }}>{body.fetched ? body.prioridad : <Oval width={'20'} height={'20'} color="#075985" />}</div>
                              )}
                            </div>
                          </section>
                          {/* Ofinica Origen */}
                          <section className={"flex flex-row"}>
                            <div>
                              <p className="">{data.oficinaOrigen}</p>
                            </div>
                          </section>
                          {/* Ultima Act */}
                          <section className={"flex flex-row"}>
                            <div className={"font-bold"}>
                              <p className="">
                                {lastUpdated?.fechaCreacion ?? formattedDate}
                              </p>
                            </div>
                          </section>
                          {/*Aqui tendria que ir el form del resto del proyecto*/}
                          {user.nivel != 4 ? (
                            <section>
                              {edit ? (
                                <section
                                  className={"flex flex-row items-center gap-4 mt-2"}
                                >
                                  <button
                                    type="submit"
                                    onClick={dispatchFunction}
                                    className={"font-semibold bg-sky-700 text-white p-1 px-4 rounded-lg"}
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    onClick={editValue}
                                    className={"font-semibold bg-red-700 text-white p-1 px-4 rounded-lg"}
                                  >
                                    Cancelar
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
                      {edit && user.nivel != 4 ? (
                        <></>
                      ) : (
                        <section className="mx-auto">
                          <button
                            onClick={editValue}
                            className={
                              "bg-sky-800 rounded-lg p-1 px-3 font-semibold text-white mt-2 text-center"
                            }
                          >
                            Editar
                          </button>
                        </section>
                      )}
                    </form>
                  </section>
                </section>

                {/* Comentarios*/}
                <div className={"w-full h-[2px] bg-gray-400 mx-auto mt-6"} />
                <div
                  key={state.success}
                  className=" flex flex-col gap-3  bg-gray-100 rounded-2xl"
                >
                  <div className="flex flex-col">
                    <h2>
                      Comentarios en Proyecto:
                      <strong> {data.titulo.toUpperCase()}</strong>
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
