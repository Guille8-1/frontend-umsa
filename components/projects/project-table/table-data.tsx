import {
  ColumnDef,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectTypes } from "@/src/schemas";

interface ProjectTableProps {
  columns: ColumnDef<ProjectTypes>[];
  data: ProjectTypes[];
  selectedProject: ProjectTypes | null;
  onSelectedProject: (project: ProjectTypes) => void;
}

export function DataTable({
  columns,
  data,
  selectedProject,
  onSelectedProject,
}: ProjectTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / pageSize),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    onSortingChange: setSorting,
    manualPagination: false,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <section className="flex items-center py-4 w-52">
        <Input
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </section>
      <section className="rounded-2xl border">
        <Table>
          <TableHeader className="rounded-lg">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="hover:bg-sky-800 bg-sky-800 rounded-lg"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(table.getRowModel().rows.length) ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      onSelectedProject(row.original);
                    }}
                    data-state={
                      selectedProject?.id === row.original.id
                        ? "selected"
                        : undefined
                    }
                    className="hover:bg-yellow-100 myTesting cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <h1 className="font-bold">Proyectos No Encontrados</h1>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className=" flex gap-3 fkespace-x-2 py-4 mx-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Pag. Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Pag. Siguiente
          </Button>
        </div>
      </section>
    </Suspense>
  );
}
