"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import DataTable from "@/components/data-table";
import Navbar from "@/components/navbar";
import Searchbar from "@/components/searchbar";
import ToggleHeader from "@/components/toggle-header";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/loader";

// Connect to WebSocket
const socket = io("ws://65.1.1.229:8080/");

export default function ApproveUserPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]); // Store OTP requests

  useEffect(() => {
    // Listen for 'newOtpRequest' event and log data into the table
    socket.on("newOtpRequest", (data) => {
      console.log("OTP Approval Request:", data);
      // Add the new OTP request data to the table
      setData((prevData) => [
        ...prevData,
        {
          phone: data.phone,
          message: data.message,
        },
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("newOtpRequest");
    };
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("message")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => approveOtpRequest(row.original.phone)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Approve
          </Button>
        </div>
      ),
    },
  ];

  // Function to send approval message to the server
  const approveOtpRequest = (phone) => {
    const message = JSON.stringify({ event: "approveOtpRequest", phone });
    socket.emit("message", message);
  };

  return (
    <>
      <ToggleHeader pageName="Approve OTP Requests" className="p-6">
        <div className="flex items-center gap-4">
          <Searchbar
            onChange={(e) => setSearchQuery(e.target.value)}
            displayText="🔍 Phone Number/Message"
          />
        </div>
      </ToggleHeader>

      <div className="max-md:h-24"></div>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      ) : (
        <DataTable columns={columns} data={filteredData} loading={loading} />
      )}
    </>
  );
}
