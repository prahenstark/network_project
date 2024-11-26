"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { fetchProtectedInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function AllDeviceTable({ data, refreshAction, mode }) {
  const { toast } = useToast();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUnbind = async (device) => {
    const apiData = { deviceId: device.deviceId };

    try {
      const response = await fetchProtectedInfo(
        "/cloudnet/device/unbind",
        "POST",
        apiData
      );

      if (response) {
        toast({
          title: "Device unbound!",
          description: "Successfully unbound Device.",
        });
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to unbind device.",
        });
      }

      refreshAction();
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  // Transform data for the table
  useEffect(() => {
    if (data) {
      // Filter data based on the mode (offline, online, or all)
      const filteredData = data.filter((device) => {
        const deviceStatus = String(device.status); // Ensure status is a string for comparison
        if (mode === "offline") {
          return deviceStatus === "0"; // Show only offline devices
        }
        if (mode === "online") {
          return deviceStatus === "1"; // Show only online devices
        }
        return true; // Show all devices for 'all' mode
      });

      // Format the filtered data
      const formattedData = filteredData.map((device, index) => ({
        id: index,
        deviceId: device.deviceId || "N/A",
        name: device.name || "N/A",
        type: device.type || "N/A",
        sn: index + 1,
        mac: device.mac || "N/A",
        ip: device.ip || "N/A",
        mode: device.mode || "N/A",
        version: device.version || "N/A",
        accessTime: device.access_time || "N/A",
        status: device.status === "1" ? <CircleCheck /> : <CircleX />,
        bg: device.status === "1" ? "green" : "red"
      }));

      setTableData(formattedData);
    }
  }, [data, mode]); // Re-run the effect if data or mode changes

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
      accessorKey: "mac",
      header: "MAC",
      cell: ({ row }) => <div className="lowercase">{row.getValue("mac")}</div>,
    },
    {
      accessorKey: "ip",
      header: "IP",
      cell: ({ row }) => <div className="lowercase">{row.getValue("ip")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "mode",
      header: "Mode",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("mode")}</div>
      ),
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Version
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("version")}</div>
      ),
    },
    {
      accessorKey: "accessTime",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Access Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("accessTime")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("status")}</div>
      ),
    },
    {
      id: "config",
      enableHiding: false,
      header: "Config",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleUnbind(row.original)}
        >
          Unbind
        </Button>
      ),
    },
  ];

  // Function to alternate row colors
  const getRowClassName = (index) => {
    return index % 2 === 0
      ? "bg-green-500 bg-opacity-10"
      : "bg-red-500 bg-opacity-20"; // Alternates green and red
  };

  return (
    <DataTable
      columns={columns}
      data={tableData}
      rowClassName={getRowClassName} // Pass the row class function
    />
  );
}

export default AllDeviceTable;
