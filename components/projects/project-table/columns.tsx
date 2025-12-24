"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { type ProjectTypes as ProjectRow } from "@/src/schemas";
import { colorValueProgress, stringPriority, stringStatus } from "./tableLogic";

export function filterAssigneesNames<TData>(
  row: Row<TData>,
  columnId: string,
  filterName: string[],
) {
  const rowValue: string = row.getValue(columnId);

  if (columnId === "asignados") {
    return filterName.some((name) =>
      rowValue.toLowerCase().includes(name.toLowerCase()),
    );
  }
  return true;
}

export const getColumns = (
  setSelectedIndex: (project: ProjectRow) => void,
): ColumnDef<ProjectRow>[] => [
    {
      accessorKey: "id",
      header: ({ column }) => {
        const setOrder = () => {
          column.toggleSorting(column.getIsSorted() === "asc");
        };
        return (
          <Button
            onClick={setOrder}
            variant="ghost"
            className="px-0 text-white hover:text-white hover:bg-sky-800 "
          >
            Id
            <ArrowUpDown />
          </Button>
        );
      },
    },
    {
      accessorKey: "asignados",
      header: ({ column }) => {
        return (
          <>
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Asignados
              <ArrowUpDown />
            </Button>
          </>
        );
      },
      cell: ({ row }) => {
        return (
          <>
            <section className="font-bold">
              {row.original.asignados.join(", ")}
            </section>
          </>
        )
      },
      filterFn: filterAssigneesNames,
    },
    {
      accessorKey: "titulo",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Titulo
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        return (
          <section
            className="text-blue-600 cursor-pointer text-center font-bold"
            onClick={() => setSelectedIndex(row.original)}
            id="update"
          >
            {row.getValue("titulo")}
          </section>
        );
      },
    },
    {
      accessorKey: "estado",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Estado
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        const value: string = row.getValue("estado");
        const colorSet = stringStatus(value);
        return (
          <section
            style={{
              color: colorSet,
            }}
            className="text-center mx-auto font-bold"
          >
            {row.getValue("estado")}
          </section>
        );
      },
    },
    {
      accessorKey: "avance",
      header: ({ column }) => {
        return (
          <>
            <section className="text-center">
              <Button
                variant="ghost"
                className="px-0 text-white hover:text-white hover:bg-sky-800 text-center mx-auto"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Avance
                <ArrowUpDown />
              </Button>
            </section>
          </>
        );
      },
      cell: ({ row }) => {
        const valProgress: number = row.getValue("avance");
        const colorStg = colorValueProgress(valProgress);
        return (
          <section
            className="text-center font-black"
            style={{
              color: colorStg,
            }}
          >
            {row.getValue("avance")} %
          </section>
        );
      },
    },
    {
      accessorKey: "citeNumero",
      header: ({ column }) => {
        return (
          <section>
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Cite Numero
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        return (
          <section className="text-center font-bold">{row.getValue("citeNumero")}</section>
        );
      },
    },
    {
      accessorKey: "rutaCv",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Ruta Cv
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        return (
          <section className="text-center font-bold">{row.getValue("rutaCv")}</section>
        );
      },
    },
    {
      accessorKey: "gestor",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Gestor
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        return (
          <section className="w-28 text-center font-bold">
            {row.original.gestor
              ? row.original.gestor.charAt(0).toUpperCase() +
              row.original.gestor.slice(1)
              : "N/A"}
          </section>
        );
      },
    },
    {
      accessorKey: "tipoDocumento",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Tipo Documento
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        return (
          <section className="text-center font-bold">
            {row.getValue("tipoDocumento")}
          </section>
        );
      },
    },
    {
      accessorKey: "prioridad",
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
        );
      },
      cell: ({ row }) => {
        const value: string = row.getValue("prioridad");
        const colorSet = stringPriority(value);
        return (
          <section
            style={{
              color: colorSet,
            }}
            className="text-center font-bold"
          >
            {row.getValue("prioridad")}
          </section>
        );
      },
    },
    {
      accessorKey: "diasActivo",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Dias Activo
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        return (
          <section className="text-center font-bold">{row.getValue("diasActivo")}</section>
        );
      },
    },
    {
      accessorKey: "oficinaOrigen",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Oficina
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        return (
          <section className="text-center font-bold">
            {row.getValue("oficinaOrigen")}
          </section>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => {
        return (
          <section className="flex">
            <Button
              variant="ghost"
              className="px-0 text-white hover:text-white hover:bg-sky-800 mx-auto"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Fecha Creacion
              <ArrowUpDown />
            </Button>
          </section>
        );
      },
      cell: ({ row }) => {
        const prjDate: string = row.getValue("createdDate");
        const prjNewDate = new Date(prjDate).toLocaleString("lp-BO", {
          timeZone: "America/La_Paz",
        });

        const date = prjNewDate.padStart(2, "0");
        const prjDateDetail = `${date}`;

        return (
          <section className="text-center font-bold">{prjDateDetail}</section>
        );
      },
    },
  ];
