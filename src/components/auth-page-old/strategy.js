import React from "react";
import ToggleHeader from "../toggle-header";
import ToggleDisplay from "../toggle-display";
import { Button } from "../ui/button";
import ProjectList from "../projects-list";
import SelectDropdown from "../select-dropdown";
import Searchbar from "../searchbar";
import IconDropdown from "../icon-dropdown";
import { FileInput } from "lucide-react";
import DataTable from "../data-table";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DatePicker from "../date-picker";

export default function Strategy() {
  const iconDropdownOptions = [
    "Create Account",
    "Reset Account",
    "Delete Account",
  ];

  const data = [];

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "sn",
      header: "SN",
      cell: ({ row }) => <div className="capitalize">{row.getValue("sn")}</div>,
    },
    {
      accessorKey: "strategyName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Strategy Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("strategyName")}</div>
      ),
    },
    {
      accessorKey: "validityAuth",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Validity Auth
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("validityAuth")}</div>
      ),
    },
    {
      accessorKey: "whiteList",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            White List
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("whiteList")}</div>
      ),
    },
    {
      accessorKey: "blackList",
      header: ({ column }) => {
        return <h1>Black List</h1>;
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("blackList")}</div>
      ),
    },

    {
      id: "config",
      enableHiding: false,
      header: () => {
        return <h1> Config</h1>;
      },
      cell: ({ row }) => {
        const payment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>config</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <ToggleHeader pageName="Strategy" className="px-6">
        <Searchbar displayText="Search" />
        <IconDropdown
          className="border-green-500 min-w-20"
          options={iconDropdownOptions}
        >
          <FileInput size={18} />
          <ChevronDown size={18} />
        </IconDropdown>
      </ToggleHeader>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
