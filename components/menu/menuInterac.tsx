"use client";

import Link from "next/link";
import { FaChartLine } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { TbActivity } from "react-icons/tb";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { TiWarning } from "react-icons/ti";

//recibir status para el menu
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/Store/valueSlice";
import { resetStatus } from "@/src/Store";
import { triggerEvent } from "@/src/Store";

type menuProps = {
  owner: boolean,
  isAuth: boolean
};

export const InteractiveMenu = ({ owner, isAuth }: menuProps) => {
  const fetchLoader = useDispatch();
  const signalLoader = () => {
    setTimeout(() => {
      fetchLoader(triggerEvent());
    }, 300)
  }
  const [selected, setSelected] = useState<string>("");
  const navOptions = [
    {
      title: "Proyectos",
      value: 'projects',
      href: "/dashboard/projects",
      icon: AiOutlineFundProjectionScreen,
    },
    {
      title: "Actividades",
      value: 'actividades',
      href: "/dashboard/actividades",
      icon: TbActivity,
    },
    {
      title: "Servicios",
      value: 'services',
      href: "/dashboard/services",
      icon: MdOutlineHomeRepairService,
    },
  ];
  const dispatch = useDispatch();
  const reNav = useSelector((state: RootState) => state.value.value);

  const [k, setK] = useState<number>(0);

  useEffect(() => {
    setK(k + 1)
  }, []);

  useEffect(() => {
    if (reNav === 'idle' || k > 0) {
      const urlInfo: string = window.location.href;
      const targetUrl = urlInfo.split("/")
      const urlLocation = targetUrl[targetUrl.length - 1];
      setSelected(urlLocation);
      dispatch(resetStatus());
    }
  }, [dispatch, reNav, k]);

  const tokenRef = useRef<HTMLDialogElement>(null);

  if (isAuth) {
    tokenRef.current?.showModal();
  }

  return (
    <>
      <section className="relative w-auto">
        <dialog className="p-7 rounded-md w-auto" ref={tokenRef}>
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
      <nav className="w-52 bg-[#25313D] flex mr-5">
        <div className="flex flex-col h-screen w-full pl-5">
          <ul className="flex flex-col gap-5 mt-10 w-full">
            <Link href={"/dashboard"} className="flex flex-col text-white">
              <h4 className="font-bold text-2xl text-white">UMSA</h4>
              <p className="font-normal text-xl">Sistema HHRR</p>
            </Link>
            <p className="text-xs font-semibold text-white">GENERAL</p>

            {owner && (
              <Link
                href={"/dashboard/users"}
                onClick={() => {
                  setSelected("usuarios");
                  signalLoader();
                }}
                className={`relative px-3 py-1 overflow-hidden
                        rounded-md
                        before:absolute before:inset-0 before:w-0 before:h-full
                        before:bg-blue-500 before:bg-opacity-30 before:right-0
                        before:transition-all before:duration-300
                        hover:before:w-full hover:before:left-0
                        cursor-pointer
                        text-white ${selected === "usuarios" ? "bg-sky-800" : ""}`}
              >
                <section className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center">
                  <FaUserFriends size="1.2em" />
                  <li>Usuarios</li>
                </section>
              </Link>
            )}
            {owner && (
              <Link
                href={"/dashboard"}
                onClick={() => {
                  setSelected("dashboard");
                  signalLoader();
                }}
                className={`relative px-3 py-1 overflow-hidden
                        rounded-md
                        before:absolute before:inset-0 before:w-0 before:h-full
                        before:bg-blue-500 before:bg-opacity-30 before:right-0
                        before:transition-all before:duration-300
                        hover:before:w-full hover:before:left-0
                        cursor-pointer
                        text-white ${selected === "dashboard" ? "bg-sky-800" : ""}`}
              >
                <section className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center">
                  <FaChartLine size="1.2em" />
                  <li>Inicio</li>
                </section>
              </Link>
            )}
            {navOptions.map(({ title, href, icon: Icon, value }) => (
              <Link
                href={href}
                onClick={() => {
                  setSelected(value);
                  signalLoader();
                }}
                key={title}
                className={`relative px-3 py-1 overflow-hidden
                          rounded-md
                          before:absolute before:inset-0 before:w-0 before:h-full
                          before:bg-blue-500 before:bg-opacity-30 before:right-0
                          before:transition-all before:duration-300
                          hover:before:w-full hover:before:left-0
                          cursor-pointer text-white ${selected === value ? "bg-sky-800" : ""}`}
              >
                <button className="">
                  <section className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center">
                    <Icon size="1.2em" />
                    <li>{title}</li>
                  </section>
                </button>
              </Link>
            ))}
            <footer className="py-5 text-xs">
              <p className="text-white ml-5 text-md ">v1.0.0</p>
            </footer>
          </ul>
        </div>
      </nav>
    </>
  );
};
