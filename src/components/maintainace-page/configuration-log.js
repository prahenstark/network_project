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

function ConfigurationLog() {
    const dropdownOptions = [
      { label: "All", value: "all" },
      { label: "Test 1", value: "test1" },
      { label: "Test 2", value: "test2" },
      { label: "Test 3", value: "test3" },
    ];

  const iconDropdownOptions = [
    "Create Account",
    "Reset Account",
    "Delete Account",
  ];

  const data = [
    {
      id: "m5gr84i9",
      sn: 1,
      configurationTime: "2024-10-25 00:15:27",
      account: "Prahen",
      nickName: "Stark",
      mac: "01-23-45-67-89-AB",
      content: "Modify Device WiFi Info",
      status: "Success",
    },
    {
      id: "3u1reuv4",
      sn: 2,
      configurationTime: "2024-10-27 00:02:53",
      account: "Arghya",
      nickName: "Decodam",
      mac: "00-B0-D0-63-C2-26",
      content: "Modify Device WiFi Info",
      status: "Failed",
    },
  ];

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
      accessorKey: "configurationTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Configuration Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("configurationTime")}</div>
      ),
    },
    {
      accessorKey: "account",
      header: ({ column }) => {
        return <h1>Account</h1>;
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("account")}</div>
      ),
    },
    {
      accessorKey: "nickName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nick Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("nickName")}</div>
      ),
    },
    {
      accessorKey: "mac",
      header: () => {
        return <h1>MAC</h1>;
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("mac")}</div>,
    },
    {
      accessorKey: "content",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Content
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("content")}</div>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },

    //   {
    //     accessorKey: "amount",
    //     header: () => <div className="text-right">Amount</div>,
    //     cell: ({ row }) => {
    //       const amount = parseFloat(row.getValue("amount"));

    //       // Format the amount as a dollar amount
    //       const formatted = new Intl.NumberFormat("en-US", {
    //         style: "currency",
    //         currency: "USD",
    //       }).format(amount);

    //       return <div className="text-right font-medium">{formatted}</div>;
    //     },
    //   },
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
      <ToggleHeader pageName="Configuration Log" className="px-6">
        <SelectDropdown className="w-28" options={dropdownOptions} />
        <DatePicker displayText="Pick a date" />
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

export default ConfigurationLog;
