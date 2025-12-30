"use client"

import { useState, useRef, useEffect, Fragment } from "react";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel
} from '@headlessui/react';
import { UserTable } from "@/src/schemas";
import ToastNotification from "@/components/ui/ToastNotification";
import { Button } from "@/components/ui/button";
import { MdCheck } from 'react-icons/md';
import { RiCloseLine } from "react-icons/ri";
import { deleteUser } from '@/actions/delete-user-action'
import { useActionState } from "react";
import { toast } from 'react-toastify';
export function UserDialogDeletion({ user, isOpen }: { user: UserTable, isOpen: boolean }) {

  const [state, dispatch] = useActionState(deleteUser, {
    errors: [],
    success: ''
  })


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
        window.location.reload();
      }, 4000)
    }
  }, [state]);
  return (
    <>
      <section className="h-auto w-full">
        {isOpen && (
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
                      className="w-auto max-w-auto transform overflow-hidden rounded-xl bg-white align-middle shadow-xl transition-all border-sky-800 border-4 p-2">
                      <section className='mx-auto w-full text-center width-full px-8'>
                        <h1 className="font-bold text-xl">Elminar Usuario: </h1>
                        <form action={dispatch}>
                          <div className='flex flex-row gap-5 items-center text-center justify-items-center justify-center mt-5'>
                            <section className='flex flex-row gap-2'>
                              <h2 className='text-black font-semibold'>Nombre:</h2>
                              <h2>{user.name} {user.lastName}</h2>
                              <input name="id" defaultValue={user.id} className="hidden" />
                            </section>
                            <section className='flex flex-row gap-2 items-center'>
                              <h2 className='text-black font-semibold'>Adminsitrador:</h2>
                              {user.admin === 'si' ? (<MdCheck color="#16a34a" size={'1em'} />) : (<RiCloseLine color="crimson" size={'1em'} />)}
                            </section>
                            <section className='flex flex-row gap-2'>
                              <h2 className='text-black font-semibold'>Nivel:</h2>
                              <h2>{user.nivel}</h2>
                            </section>
                          </div>
                          <section
                            className="mx-auto w-full width-full flex flex-row items-center justify-items-center justify-center text-center gap-10 mt-5">
                            <Button
                              type="submit"
                              variant='link'
                              className='bg-green-200 text-black'
                              value="Si"
                            >Si</Button>
                            <Button
                              variant='destructive'
                              className="bg-red-200 text-black"
                              onClick={isClosed}>
                              No
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
