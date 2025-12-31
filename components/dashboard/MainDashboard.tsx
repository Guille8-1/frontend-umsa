"use client";

import { TiWarning } from "react-icons/ti";
import { StatsDashboard } from "./StatsDashboard";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
//redux loading state
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { resetStatus } from "@/src/Store";
import Loader from "../loader/Spinner";

type mainDashBoradProps = {
  chPassword: boolean,
  isAuth: boolean,
  token: string,
  secret: string
}

export default function DashboardStart({ chPassword, isAuth, token, secret }: mainDashBoradProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  setTimeout(() => {
    if (!chPassword) {
      dialogRef.current?.showModal();
    }
  }, 500);

  const tokenCheck = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isAuth) {
      tokenCheck.current?.showModal();
    }
  }, []);
  const dispatch = useDispatch();
  const reFetch = useSelector((state: RootState) => state.value.value);

  const [ux, setUx] = useState<boolean>(false);

  useEffect(() => {
    if (reFetch === 'idle') {
      setUx(true)
    }
    dispatch(resetStatus());
  }, [reFetch, dispatch])

  return (
    <>
      <section>
        <dialog className="p-7 rounded-md w-fit" ref={tokenCheck}>
          <section className="flex flex-col gap-5">
            <div className="flex flex-row items-center gap-2">
              <TiWarning className="text-[#D32F2F] w-8 h-8" />
              <h3 className="font-semibold text-sky-800 text-lg">
                Para continuar, debe restablecer la contraseña
              </h3>
            </div>

            <Link
              href={"auth/login"}
              autoFocus={false}
              className="text-center p-2 w-1/2 mx-auto border-2 border-solid border-sky-700 bg-slate-100 rounded-md"
            >
              Token Expirado
            </Link>
          </section>
        </dialog>
      </section>

      <section>
        <dialog className="p-7 rounded-md" ref={dialogRef}>
          <section className="flex flex-col gap-5">
            <div className="flex flex-row items-center gap-2">
              <TiWarning className="text-[#D32F2F] w-8 h-8" />
              <h3 className="font-semibold text-sky-800 text-lg">
                Para continuar, debe restablecer la contraseña
              </h3>
            </div>

            <Link
              href={"/reset-password"}
              autoFocus={false}
              className="text-center p-2 w-1/2 mx-auto border-2 border-solid border-sky-700 bg-slate-100 rounded-md"
            >
              Restablecer Contraseña
            </Link>
          </section>
        </dialog>
      </section>

      <section className={`${ux ? 'block' : 'opacity-20'}`}>
        <div className="flex flex-col md:flex-row md:justify-between items-left">
          <div className="w-full md:w-auto flex flex-row items-center gap-2">
            <h2 className="font-bold text-xl text-sky-800 my-5">
              Panel Principal
            </h2>
            <p className="text-xl font-semibold">
              Gestion & Administracion {""} Proyectos - Actividades
            </p>
          </div>
        </div>
        <section>
          <StatsDashboard token={token} secret={secret} />
        </section>
      </section>
      <section className={`${ux ? 'hidden' : 'flex'} relative justify-center items-center mx-auto bottom-[400px]`}>
        <Loader />
      </section>
    </>
  );
}
