"use client"

import { TiPlus } from "react-icons/ti"
import { Fragment, useEffect, useRef, useState } from "react"
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import ActivityForm from "./CreateActivityForm"
import ToastNotification from "../ui/ToastNotification"


export function ActivityActionPage({ admin, token, secret }: { admin: boolean, token: string, secret: string }) {
    const [open, setOpen] = useState(false)
    const dialogRef = useRef(null)

    const isOpen = () => setOpen(true);
    const isClosed = () => setOpen(false);

    useEffect(()=>{
        const handleClick = () => {
            if (dialogRef.current) {
                isClosed()
            }
        };
        if (open) {
            window.addEventListener('click', handleClick)
        }
        return () => {
            window.removeEventListener("click", handleClick)
        }
    },[open])


    return (
        <>
            <section className="h-auto w-full">
                {admin && <button
                    onClick={isOpen}
                    className="flex flex-row align-items-center justify-items-center gap-2 bg-sky-800 p-3 text-gray-200 rounded"
                >
                    <TiPlus size="1.1em" className="mt-0.5" />
                    <h2 className="font-semibold text-lg leading-tight">
                        Crear Nueva Actividad
                    </h2>
                </button>}
                {open && (
                    <Transition appear show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" onClose={isClosed}>
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black/60" />
                            </TransitionChild>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <TransitionChild
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <DialogPanel
                                            className="w-1/2 max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all py-6">
                                            <section className={'flex flex-row justify-between w-3/4 mx-auto'}>
                                                <h1 className="font-bold text-xl">Crear Nueva Actividad</h1>
                                                <button
                                                    onClick={()=>{
                                                        isClosed();
                                                    }}
                                                    className={'text-white font-semibold bg-red-500 px-4 py-2 rounded-xl'}
                                                >X</button>
                                            </section>
                                            <section>
                                                <ActivityForm
                                                    secret={secret}
                                                    token={token}
                                                />
                                            </section>
                                            <div className="mx-auto my-0 mt-5 flex justify-end">
                                                <ToastNotification />
                                            </div>
                                        </DialogPanel>
                                    </TransitionChild>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                )}
            </section>
        </>
    )
}