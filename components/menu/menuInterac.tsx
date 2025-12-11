"use client";

import Link from "next/link";
import { FaChartLine } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { TbActivity } from "react-icons/tb";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { useEffect, useState } from "react";

export const InteractiveMenu = ({ owner }: { owner: boolean }) => {
  const [selected, setSelected] = useState<string>("");
  const navOptions = [
    {
      title: "dashboard",
      href: "/dashboard",
      icon: FaChartLine,
    },
    {
      title: "proyectos",
      href: "/dashboard/projects",
      icon: AiOutlineFundProjectionScreen,
    },
    {
      title: "actividades",
      href: "/dashboard/actividades",
      icon: TbActivity,
    },
    {
      title: "services",
      href: "/dashboard/services",
      icon: MdOutlineHomeRepairService,
    },
  ];
  useEffect(() => {
    const urlInfo: string = window.location.href;
    const targetUrl = urlInfo.split("/")
    const urlLocation = targetUrl[targetUrl.length - 1];
    console.log('0', urlInfo);
    console.log('1', urlLocation);
    setSelected(urlLocation);
  }, [])

  return (
    <>
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
                }}
                className={`relative px-3 py-1 overflow-hidden
                        rounded-md
                        before:absolute before:inset-0 before:w-0 before:h-full
                        before:bg-blue-500 before:bg-opacity-30 before:right-0
                        before:transition-all before:duration-300
                        hover:before:w-full hover:before:left-0
                        cursor-pointer
                        text-white ${selected === "usuarios" ? "bg-blue-600" : ""}`}
              >
                <section className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center">
                  <FaUserFriends size="1.2em" />
                  <li>Usuarios</li>
                </section>
              </Link>
            )}
            {navOptions.map(({ title, href, icon: Icon }) => (
              <Link
                href={href}
                onClick={() => {
                  setSelected(title);
                }}
                key={title}
                className={`relative px-3 py-1 overflow-hidden
                          rounded-md
                          before:absolute before:inset-0 before:w-0 before:h-full
                          before:bg-blue-500 before:bg-opacity-30 before:right-0
                          before:transition-all before:duration-300
                          hover:before:w-full hover:before:left-0
                          cursor-pointer
                          text-white ${selected === title ? "bg-blue-600" : ""}`}
              >
                <button className="">
                  <section className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center">
                    <Icon size="1.2em" />
                    <li>{title}</li>
                  </section>
                </button>
              </Link>
            ))}
            {/*{owner && (
              <Link
                href={"/dashboard/users"}
                className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center"
              >
                <FaUserFriends size="1.2em" />
                <li>Usuarios</li>
              </Link>
            )}
            <Link
              href={"/dashboard/projects"}
              className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center"
            >
              <AiOutlineFundProjectionScreen size="1.2em" />
              <li>Proyectos</li>
            </Link>
            <Link
              href={"/dashboard/actividades"}
              className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3"
            >
              <TbActivity size="1.2em" />
              <li>Actividades</li>
            </Link>
            <Link
              href={"/dashboard/services"}
              className="text-white font-semibold py-2 hover:text-sky-200 text-lg transition duration-300 flex flex-row gap-3 items-center"
            >
              <MdOutlineHomeRepairService size="1.2em" />
              <li>Servicios</li>
            </Link>*/}
            <footer className="py-5 text-xs">
              <p className="text-white ml-5 text-md ">v1.0.0</p>
            </footer>
          </ul>
        </div>
      </nav>
    </>
  );
};
