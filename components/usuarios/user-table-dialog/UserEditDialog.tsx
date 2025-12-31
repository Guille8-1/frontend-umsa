"use client"

import { useState, useRef, useEffect, Fragment, useActionState } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel
} from '@headlessui/react';
import { UserTable } from "@/src/schemas";
import ToastNotification from "@/components/ui/ToastNotification";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setValue } from "@/src/Store";
import { toast } from "react-toastify";
import { editUser } from "@/actions/edit-user-action";

export const UserDialogEdit = ({ user, isOpen }: { user: UserTable, isOpen: boolean }) => {
  const fetchDispatch = useDispatch();
  const dispatchFunction = () => {
    fetchDispatch(setValue("changed"));
  };

  const { id } = user;

  const [state, dispatch] = useActionState(editUser, {
    errors: [],
    success: ''
  })
  const { name, lastName, admin, nivel } = user;
  const [open, setOpen] = useState<boolean>(true);
  const dialogRef = useRef(null);
  const keepValue = useRef(false);

  const isClosed = () => setOpen(false);
  useEffect(() => {
    const handleClick = () => {
      if (dialogRef.current) {
        isClosed();
      }
    };
    if (open) {
      window.addEventListener("click", handleClick);
      keepValue.current = true;
    }
    return () => {
      window.removeEventListener("click", handleClick);
      keepValue.current = false;
    }
  }, [isOpen, open]);
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
        isClosed();
        dispatchFunction();
      }, 4000)
    }
  }, [state]);

  return (
    <>
      <section className="w-full h-auto">
        {isOpen && (
          <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative w-[200px] z-10" onClose={isClosed}>
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
                      className="max-w-auto transform overflow-hidden rounded-xl bg-white align-middle shadow-xl transition-all border-sky-800 border-4 p-2 w-1/4">
                      <section className='mx-auto w-full text-center width-full py-8 px-4'>
                        <h1 className="font-bold text-xl">Editar Usuario: </h1>
                        <form action={dispatch} className="w-full">
                          <div className='flex flex-col gap-5 items-center text-center justify-items-center justify-center mt-5'>
                            <section className='flex flex-row gap-2'>
                              <h2 className='text-black font-semibold'>Nombre:</h2>
                              <h2>{name} {lastName}</h2>
                              <input name="id" defaultValue={id} className="hidden" />
                            </section>
                            <section className='flex flex-row gap-2 justify-center items-center w-full mx-auto'>
                              <h2 className='text-black font-semibold'>Nivel:</h2>
                              {user.nivel === 1 ? (
                                <h2>Usuario No Editable</h2>
                              ) :
                                (
                                  <>
                                    <section className="flex flex-col w-8">
                                      <select name="nivel" id="select" className="w-[70px] text-center">
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                      </select>
                                    </section>
                                  </>
                                )
                              }
                            </section>
                          </div>
                          <section
                            className="mx-auto w-full width-full flex flex-row items-center justify-items-center justify-center text-center gap-10 mt-5">
                            <Button
                              type="submit"
                              variant='link'
                              className='bg-green-200 text-black hover:bg-green-400 hover:no-underline hover:text-white'
                              value="Si"
                              disabled={user.nivel === 1 ? true : false}
                            >Guardar
                            </Button>
                            <Button
                              variant='destructive'
                              className="bg-red-200 text-black hover:text-white"
                              onClick={isClosed}>
                              Cancelar
                            </Button>
                          </section>
                        </form>
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
