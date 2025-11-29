import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from "lucide-react";
import { type ActivityTypes as ActivityRow } from "@/src/schemas";
import { filterAssigneesNames } from "@/components/projects/project-table/columns";
import { colorValueProgress, stringPriority, stringStatus } from "@/components/projects/project-table/tableLogic";
import { string } from "zod";
import { color } from "framer-motion";




export const getColumns = (setSelectedIndex: (activity: ActivityRow) => void): ColumnDef<ActivityRow>[] => [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    className="px-0 text-white hover:text-white hover:bg-sky-800"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Id
                    <ArrowUpDown />
                </Button>
            )
        }
    },
    {
        accessorKey: 'asignados',
        header: ({ column }) => {
            return (
                <section className="">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 "
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Asignados
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => (
            <section className="w-auto">
                {
                    row.original.asignadosActividad?.map((asignado) => asignado.charAt(0).toUpperCase() + asignado.slice(1)).join(", ") || "N/A"
                }
            </section>
        ),
        filterFn: filterAssigneesNames
    },
    {
        accessorKey: 'tituloActividad',
        header: ({ column }) => {
            return (
                <section className="flex flex-row">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Titulo Actividad
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => (
            <div
                className="text-blue-600 cursor-pointer text-center"
                onClick={() => setSelectedIndex(row.original)}
            >
                {row.getValue("tituloActividad")}
            </div>
        )
    },
    {
        accessorKey: 'estadoActividad',
        header: ({ column }) => {
            return (
                <section className="flex flex-row">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Estado
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("estadoActividad");
            const colorSet = stringStatus(value);
            return (
                <section
                    style={{
                        color: colorSet
                    }}
                    className="text-center mx-auto font-semibold"
                >
                    {row.getValue("estadoActividad")}
                </section>
            )
        }
    },
    {
        accessorKey: 'avanceActividad',
        header: ({ column }) => {
            return (
                <section className="flex">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Avance
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => {
            const val: number = row.getValue('avanceActividad');
            const colorStg = colorValueProgress(val);
            return (
                <section
                    className={`text-center`}
                    style={{
                        color: colorStg
                    }}
                >
                    {row.getValue('avanceActividad')} %
                </section>
            )
        }
    }, {
        accessorKey: 'gestor',
        header: ({ column }) => {
            return (
                <section className="flex">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Gestor Actividad
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => (
            <section className="text-center">
                {row.original.gestorActividad ? row.original.gestorActividad.charAt(0).toUpperCase() + row.original.gestorActividad.slice(1) : "N/A"}
            </section>
        )
    },
    {
        accessorKey: 'prioridadActividad',
        header: ({ column }) => {
            return (
                <section className="flex">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Prioridad
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue('prioridadActividad')
            const colorSet = stringPriority(value)
            return (
                <section 
                style={{
                    color: colorSet
                }}
                className={`text-center`}>
                    {row.getValue('prioridadActividad')}
                </section>
            )
        }
    },
    {
        accessorKey: 'diasActivoActividad',
        header: ({ column }) => {
            return (
                <section className="flex">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Dias Act
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => (
            <section className="text-center">
                {row.getValue('diasActivoActividad')}
            </section>
        )
    },
    {
        accessorKey: 'oficinaOrigenActividad',
        header: ({ column }) => {
            return (
                <section className="flex">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Origen
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        },
        cell: ({ row }) => (
            <section className="text-center">
                {row.getValue('oficinaOrigenActividad')}
            </section>
        )
    },
    {
        accessorKey: 'createdDate',
        header: ({ column }) => {
            return (
                <section className="flex flex-row align-middle">
                    <Button
                        variant="ghost"
                        className="px-0 text-white hover:text-white hover:bg-sky-800 text-right mx-auto"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Creacion
                        <ArrowUpDown />
                    </Button>
                </section>
            )
        }
    },
]
