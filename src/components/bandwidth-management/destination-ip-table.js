import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DestinationIPTable({
  columns = [],
  rawData,
  loading,
  rowClassName,
}) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [expandedCells, setExpandedCells] = useState({}); // Track expanded cells

  const data = rawData || [];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const toggleCellExpansion = (rowId, columnId) => {
    const cellKey = `${rowId}-${columnId}`;
    setExpandedCells((prev) => ({
      ...prev,
      [cellKey]: !prev[cellKey],
    }));
  };

  return (
    <div className="max-w-full p-6">
      <div className="rounded-md border">
        <Table suppressHydrationWarning>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {!loading && (
            <TableBody>
              {table.getRowModel()?.rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={rowClassName ? rowClassName(row.index) : ""}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isExpandable =
                        cell.column.columnDef?.isExpandable ?? false;
                      const cellKey = `${row.id}-${cell.column.id}`;
                      const isExpanded = expandedCells[cellKey];

                      return (
                        <TableCell key={cell.id}>
                          <div
                            className={`flex items-center ${
                              isExpandable && !isExpanded
                                ? "max-w-[10rem] truncate overflow-hidden text-ellipsis"
                                : ""
                            }`}
                          >
                            {isExpandable && (
                              <button
                                onClick={() =>
                                  toggleCellExpansion(row.id, cell.column.id)
                                }
                                className="mr-2 text-gray-600 hover:text-gray-900"
                              >
                                {isExpanded ? "▼" : "▶"}
                              </button>
                            )}
                            {isExpanded
                              ? cell.getValue() // Show full content when expanded
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            className="border-2 border-green-500 bg-transparent"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className="border-2 border-green-500 bg-green-500"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
