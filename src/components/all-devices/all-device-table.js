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
import { Plus } from "lucide-react";
import UpdateCredsModal from "@/components/all-devices/update-creds-modal";
import { ToggleSwitch } from "../ui/toggle-switch";
import { ImageIcon } from "lucide-react";
import LogoUplopadModal from "./logo-upload-modal";

function AllDeviceTable({ data, refreshAction, mode }) {
  const { toast } = useToast();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

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

  const handleToggle = async (row, checked, setChecked) => {
    try {
      // Store the new status
      const newStatus = !checked;

      const apiData = {
        deviceId: row.original.deviceId,
        flag: newStatus,
      };

      // Make API call before updating UI
      const response = await fetchProtectedInfo(
        "/devices/handle-device-approval",
        "POST",
        apiData
      );

      if (response) {
        // Only update UI state if API call succeeds
        toast({
          title: "Device approved!",
          description: "Successfully approved Device.",
        });
        ``;
      } else {
        // setChecked();
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to approve device.",
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

  const handleUpdateCreds = (device) => {
    setSelectedDevice(device); // Set the selected device
    setIsModalOpen(true); // Open the modal
    console.log("Selected Device for Update Creds:", device);
  };

  const handleLogoUpload = (device) => {
    setSelectedDevice(device); // Set the selected device
    setIsLogoModalOpen(true);
  };

  // Transform data for the table
  useEffect(() => {
    if (data) {
      const filteredData = data.filter((device) => {
        const deviceStatus = String(device.status);
        if (mode === "offline") {
          return deviceStatus === "0";
        }
        if (mode === "online") {
          return deviceStatus === "1";
        }
        return true;
      });

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
        bg: device.status === "1" ? "green" : "red",
        onApproval: device.onApproval || false,
        logo: device.logo || null,
      }));

      setTableData(formattedData);
    }
  }, [data, mode]);

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
      accessorKey: "deviceId",
      header: "deviceId",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("deviceId")}</div>
      ),
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
      accessorKey: "onApproval",
      header: "Approval",
      cell: ({ row }) => {
        const [checked, setChecked] = useState(
          row.getValue("onApproval") === true
        );
        return (
          <ToggleSwitch
            checked={checked}
            onChange={() => handleToggle(row, checked, setChecked)}
          />
        );
      },
    },

    {
      id: "updateLogo",
      enableHiding: false,
      header: "Logo",
      cell: ({ row }) => (
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => handleLogoUpload(row.original)}
        >
          <ImageIcon />
          Upload Logo
        </Button>
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
    {
      id: "updateCreds",
      enableHiding: false,
      header: "Action",
      cell: ({ row }) => (
        <Button size="sm" onClick={() => handleUpdateCreds(row.original)}>
          Update Creds
        </Button>
      ),
    },
  ];

  const getRowClassName = (index) => {
    return index % 2 === 0
      ? "bg-green-500 bg-opacity-10"
      : "bg-red-500 bg-opacity-20";
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        rowClassName={getRowClassName}
      />

      <UpdateCredsModal
        device={selectedDevice}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {isLogoModalOpen && (
        <LogoUplopadModal
          device={selectedDevice}
          isOpen={isLogoModalOpen}
          refreshAction={refreshAction}
          onClose={() => (setIsLogoModalOpen(false), setSelectedDevice(null))}
        />
      )}
    </>
  );
}

export default AllDeviceTable;
