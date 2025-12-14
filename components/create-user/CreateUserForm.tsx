"use client";

import { createUser } from "@/actions/create-user-action";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { TiWarning } from "react-icons/ti";
import { IoClose } from "react-icons/io5";

export default function CreateUserForm() {
  const [state, dispatch] = useActionState(createUser, {
    errors: [],
    success: "",
  });

  const nameReview = useRef<HTMLInputElement>(null!);
  const lastNameReview = useRef<HTMLInputElement>(null!);
  const emailReview = useRef<HTMLInputElement>(null!);
  const pwReview = useRef<HTMLInputElement>(null!);
  const levelReview = useRef<HTMLSelectElement>(null!);

  const [reviewValues, setReviewValues] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });
  const [nivel, setNivel] = useState<string>("");

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReviewValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNivel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nivelValue = e.target.value;
    setNivel(nivelValue);
  };
  const checkPwRef = useRef<HTMLDialogElement>(null!);

  const closeFn = () => {
    setTimeout(() => {
      checkPwRef.current?.close();
    }, 200);
  };

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
      checkPwRef.current?.showModal();
    }
  }, [state]);
  return (
    <>
      <form className="mt-14 space-y-3" noValidate action={dispatch}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col w-full">
              <label className="font-bold text-2xl" htmlFor="email">
                Nombre
              </label>
              <input
                value={reviewValues.nombre}
                onChange={handleCheck}
                ref={nameReview}
                id="nombre"
                type="text"
                placeholder="Nombre"
                className="w-full border border-gray-300 p-3 rounded-lg"
                name="nombre"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="font-bold text-2xl" htmlFor="email">
                Apellido
              </label>
              <input
                value={reviewValues.apellido}
                onChange={handleCheck}
                ref={lastNameReview}
                id="nombre"
                type="text"
                placeholder="Apellido"
                className="w-full border border-gray-300 p-3 rounded-lg"
                name="apellido"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl" htmlFor="email">
            Email
          </label>
          <input
            value={reviewValues.email}
            onChange={handleCheck}
            ref={emailReview}
            id="email"
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl" htmlFor="password">
            Password (Se recomienda usar numero de carnet)
          </label>
          <input
            value={reviewValues.password}
            onChange={handleCheck}
            ref={pwReview}
            id="password"
            type="text"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-lg mt-3" htmlFor="estado">
            Nivel Usuario
          </label>
          <select
            value={nivel}
            onChange={handleNivel}
            ref={levelReview}
            name="nivelUsuario"
            id="nivelUsuario"
            className="w-full border border-gray-300 p-3 rounded-lg"
          >
            <option value="" defaultChecked>
              Seleccionar
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <input
          className="bg-cyan-800 hover:bg-cyan-700 w-full p-3 rounded-lg text-white text-xl font-bold cursor-pointer block"
          onClick={() => {
            checkPwRef.current?.showModal();
          }}
          type="button"
          value="Registrar"
        />

        <dialog
          className="rounded-md bg-slate-300 p-5 relative"
          ref={checkPwRef}
        >
          <IoClose
            size={"2rem"}
            color={"#D32F2F"}
            className="bg-gray-200 rounded-lg top-0 right-0 absolute cursor-pointer"
            onClick={() => {
              checkPwRef.current?.close();
            }}
          />
          <section className="mt-6">
            <section className="flex flex-row items-center gap-4">
              <TiWarning className="text-red-500 w-8 h-8" />
              <h3 className="font-bold text-xl">
                Revise la Contraseña y el Nombre antes de continuar
              </h3>
            </section>
            <section className="flex flex-col mt-4 justify-items-center">
              <p className="text-lg">
                Nombre:
                <span className="font-bold text-lg">
                  {" "}
                  {reviewValues.nombre}
                </span>
              </p>
              <p className="text-lg">
                Apellido:
                <span className="font-bold text-lg">
                  {" "}
                  {reviewValues.apellido}
                </span>
              </p>
              <p className="text-lg">
                Email:
                <span className="font-bold text-lg"> {reviewValues.email}</span>
              </p>
              <p className="text-lg">
                Password:
                <span className="font-bold text-lg">
                  {" "}
                  {reviewValues.password}
                </span>
              </p>
              <p className="text-lg">
                Nivel:
                <span className="font-bold text-lg"> {nivel}</span>
              </p>
            </section>
            <input
              className="bg-cyan-800 hover:bg-cyan-700 w-full p-3 rounded-lg text-white text-xl font-bold cursor-pointer block mt-6"
              type="submit"
              value="Registrar"
              onClick={() => {
                closeFn();
              }}
            />
          </section>
        </dialog>
      </form>
    </>
  );
}
