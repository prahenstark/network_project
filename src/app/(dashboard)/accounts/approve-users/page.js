"use client";

import { useEffect, useState } from "react";
import DataTable from "@/components/data-table";
import Navbar from "@/components/navbar";
import Searchbar from "@/components/searchbar";
import ToggleHeader from "@/components/toggle-header";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/loader";


export default function ApproveUserPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket("ws://65.1.1.229:8080");

    ws.onopen = () => {
      console.log("Connected to WebSocket server.");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        console.log("OTP Approval Request:", receivedData);
        setData((prevData) => [
          ...prevData,
          {
            phone: receivedData.phone,
            message: receivedData.message,
          },
        ]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server.");
      setTimeout(() => {
        console.log("Reconnecting...");
        setSocket(new WebSocket("wss://65.1.1.229:8080"));
      }, 3000); // Auto-reconnect after 3 seconds
    };

    return () => {
      ws.close();
    };
  }, []);

  const approveOtpRequest = (phone) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ event: "approveOtpRequest", phone });
      socket.send(message);
    } else {
      console.error("WebSocket is not connected.");
    }
  };

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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => <div className="lowercase">{row.getValue("message")}</div>,
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
