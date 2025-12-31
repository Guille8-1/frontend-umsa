import {
  ColumnDef,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable, RowSelectionState
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface UserTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataUsersTable<TData, TValue>({ columns, data }: UserTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [pageIndex, setPageIndex] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(20)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})


  const table = useReactTable({
    data,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    onSortingChange: setSorting,
    manualPagination: false,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater
      setPageIndex(newState.pageIndex)
      setPageSize(newState.pageSize)
    },
    state: {
      sorting,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize
      },
    },
    onRowSelectionChange: setRowSelection
  })

  return (
    <>
      <section className="flex items-center py-4 w-52">
        <Input
          placeholder="Buscar..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </section>
      <section>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-sky-800 bg-sky-800"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                    >
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isSelected = row.getIsSelected()
                return (
                  <TableRow
                    onClick={() => {
                      table.resetRowSelection()
                      row.toggleSelected(true)
                    }}
                    className={`hover:bg-yellow-100 ${isSelected ? 'bg-yellow-100' : ''}`}
                    key={row.id}
                    data-state={row.getIsSelected() && "Seleccionado"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center mx-auto">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <h1 className="font-bold">Usuarios No Encontrados</h1>
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
    </>
  )
}
