import { ColumnDef, Row } from '@tanstack/react-table'
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from 'lucide-react'
import { type UserTable as UserRow } from '@/src/schemas'
// import {
//     DropdownMenu,
//     DropdownMenuTrigger,
//     DropdownMenuContent,
//     DropdownMenuLabel,
//     DropdownMenuItem,
//     DropdownMenuSeparator
// } from "@/components/ui/dropdown-menu";
// import {FaChevronDown} from "react-icons/fa";
// import {FaRegTrashCan} from "react-icons/fa6";
import { UserDialogDeletion } from "@/components/usuarios/user-table-dialog/UserDialog";
import { useState } from "react";
import { FaRegTrashCan, FaPencil } from "react-icons/fa6";


export function filterNames<TData>(
  row: Row<TData>,
  columnId: string,
  filterName: string[]
) {
  const rowValue: string = row.getValue(columnId)

  if (columnId === 'nombre') {
    return filterName.some((name) => rowValue.toLowerCase().includes(name.toLowerCase()))
  }
  return true;
}

export const getUserColumns = (setSelectedIndex: (user: UserRow) => void): ColumnDef<UserRow>[] =>

  [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <>
            <section className='text-center'>
              <Button
                variant="ghost"
                className="px-0 text-white hover:text-white hover:bg-sky-800 "
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                id
                <ArrowUpDown />
              </Button>
            </section>
          </>
        )
      }
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <>
            <section className='text-center'>
              <Button
                variant="ghost"
                className="px-0 text-white hover:text-white hover:bg-sky-800 "
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Nombre
                <ArrowUpDown />
              </Button>
            </section>
          </>
        )
      },
      cell: ({ row }) => row.original.name.charAt(0).toUpperCase() + row.original.name.slice(1),
      filterFn: filterNames
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => {
        return (
          <>
            <section className='text-center'>
              <Button
                variant="ghost"
                className="px-0 text-white hover:text-white hover:bg-sky-800 "
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Apellido
                <ArrowUpDown />
              </Button>
            </section>
          </>

        )
      }
    },
    {
      accessorKey: 'admin',
      header: ({ column }) => {
        return (
          <>
            <section className='text-center'>
              <Button
                variant="ghost"
                className="px-0 text-white hover:text-white hover:bg-sky-800 "
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Administrador
                <ArrowUpDown />
              </Button>
            </section>
          </>
        )
      }
    },
    {
      accessorKey: 'nivel',
      header: ({ column }) => {
        return (
          <>
            <section className='text-center'>
              <Button
                variant="ghost"
                className="px-0 text-white hover:text-white hover:bg-sky-800 "
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Nivel
                <ArrowUpDown />
              </Button>
            </section>
          </>
        )
      }
    },
    {
      id: 'actions',
      enableHiding: false,
      header: ({ }) => {
        return (
          <>
            <section className='text-center'>
              <Button
                variant="ghost"
                className="px-0 text-white hover:text-white hover:bg-sky-800 "
              >
                Acciones
              </Button>
            </section>
          </>
        )
      },
      cell: ({ row }) => {
        const [value, setValue] = useState<boolean>(false);
        const [edit, setEdit] = useState<boolean>(false);
        const settingDialog = () => {
          if (value) {
            setValue(false)
          } else {
            setValue(true);
          }
        }
        const settingEdit = () => {
          if (edit) {
            setEdit(false)
          } else {
            setEdit(true)
          }
        }
        return (
          <>
            <section
              className="w-full flex flex-row gap-5 mx-auto justify-center"
            >
              <button
                onClick={settingDialog}
              >
                <FaRegTrashCan
                  size='15'
                  color='crimson'
                  className=""
                />
              </button>
              <button
                onClick={settingEdit}
              >
                <FaPencil
                  size='15'
                  color='#075985'
                  className=""
                />
              </button>
            </section>
            {value && (
              <UserDialogDeletion
                user={row.original}
                isOpen={value}
              />
            )}
            {
              edit && (
                <h1>Hello suckers</h1>
              )
            }
          </>
        )
      },
    },
  ]
