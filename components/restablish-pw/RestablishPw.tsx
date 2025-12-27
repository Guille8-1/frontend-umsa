"use client";

import { useActionState, useEffect, useState } from "react";
import { resetPwAction } from "@/actions/reset-password-actions";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

export default function RestablishingPw() {
  const [state, dispatch] = useActionState(resetPwAction, {
    errors: [],
    success: "",
  });

  const [password, setPassword] = useState<boolean>(false);

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => {
        toast.error(error);
      });
    }
  }, [state]);
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
      setTimeout(() => {
        redirect("/dashboard");
      }, 1500);
    }
  }, [state]);
  const revealPassword = () => {
    setPassword(true);
    if (password) {
      setPassword(false);
    }
  };
  return (
    <>
      <form className="mt-2" noValidate action={dispatch}>
        <div className="flex flex-col w-full">
          <div className="flex flex-col gap-8 w-[500px]">
            <div className="flex flex-col">
              <label className="font-bold text-2xl" htmlFor="email">
                Nueva Contraseña
              </label>
              <div className="flex flex-row items-center gap-2">
                <input
                  id="nombre"
                  type={password ? "text" : "password"}
                  placeholder="Contraseña"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  name="password"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="font-bold text-2xl" htmlFor="email">
                Repetir Contraseña
              </label>
              <div className="flex flex-row items-center gap-2">
                <input
                  id="nombre"
                  type={password ? "text" : "password"}
                  placeholder="Repetir Contraseña"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  name="repeated_password"
                />
              </div>
            </div>
          </div>
        </div>
        <input
          className="bg-gray-500 hover:bg-gray-400 w-full p-3 rounded-lg text-white text-xl font-bold cursor-pointer block mt-8"
          type="button"
          value={password ? "Ocultar Contraseñas" : "Revisar Contraseñas"}
          onClick={revealPassword}
        />
        <input
          className="bg-cyan-800 hover:bg-cyan-700 w-full p-3 rounded-lg text-white text-xl font-bold cursor-pointer block mt-8"
          type="submit"
          value="Restablecer Contraseña"
        />
      </form>
    </>
  );
}
