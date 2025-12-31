"use client"

import { login } from "@/actions/login-account-action"
import { useActionState, useEffect, useState } from "react"
import { toast } from "react-toastify";
import { redirect } from 'next/navigation'
import Loader from "../loader/Spinner";
import Image from 'next/image';


export default function LoginFrom() {

  const [ux, setUx] = useState<boolean>(true)
  const [state, dispatch] = useActionState(login, {
    errors: [],
    success: ''
  })

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach(error => {
        toast.error(error)
      })
      setUx(true);
    }
  }, [state]);

  useEffect(() => {
    if (state.success) {
      setUx(false);
      setTimeout(() => {
        redirect('/dashboard');
      }, 1)
    }
  }, [state])
  return (
    <>

      <section className={`${ux ? 'block' : 'opacity-20'} `}>
        <div className='flex flex-col items-center gap-10 md:flex-row'>
          <div className='flex flex-col text-center sm:justify-start justify-center'>
            <h1 className="font-bold text-4xl text-cyan-600">Sistema de Información y</h1>
            <p className="text-3xl font-bold text-cyan-600">{" "} Gestión de Infraestructura</p>
          </div>
          <Image src="/umsaoff.jfif" width={190} height={125} alt='off-umsa'></Image>
        </div>
        <form
          className="mt-14 space-y-5"
          noValidate
          action={dispatch}
        >
          <div className="flex flex-col gap-2">
            <label
              className="font-bold text-2xl"
              htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 p-3 rounded-lg"
              name="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="font-bold text-2xl"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 rounded-lg"
              name="password"
            />
          </div>
          <input
            className="bg-cyan-800 hover:bg-cyan-700 w-2/4 mx-auto p-3 rounded-lg text-white text-xl font-bold cursor-pointer block"
            type="submit"
            value="Ingresar"
          />
        </form>
      </section>
      <section className={`${ux ? 'hidden' : 'flex'} relative justify-center items-center mx-auto bottom-[400px]`}>
        <Loader />
      </section>
    </>
  )
}
