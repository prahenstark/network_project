"use client";

import { useEffect, useRef, useState } from "react";
import DataTable from "@/components/data-table";
import Navbar from "@/components/navbar";
import Searchbar from "@/components/searchbar";
import ToggleHeader from "@/components/toggle-header";

import { ArrowUpDown, Loader2 } from "lucide-react"; // Loader icon
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/loader";
import { toast } from "@/hooks/use-toast";

export default function ApproveUserPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loadingActions, setLoadingActions] = useState({}); // Track loading state for each row
  const socketRef = useRef(null); // WebSocket reference

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ws = new WebSocket("ws://65.1.1.229:8080");

      ws.onopen = () => console.log("Connected to WebSocket server.");

      ws.onmessage = (event) => {
        try {
          const receivedData = JSON.parse(event.data);
          console.log("Received WebSocket Data:", receivedData);

          if (receivedData.event === "newOtpRequest") {
            console.log("OTP Approval Request:", receivedData);
            setData((prev) => [...prev, receivedData]); // Add new OTP request
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => console.error("WebSocket error:", error);
      ws.onclose = () => console.log("Disconnected from WebSocket server.");

      socketRef.current = ws;

      return () => {
        ws.close();
      };
    }
  }, []);

  const approveOtpRequest = (phone) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setLoadingActions((prev) => ({ ...prev, [phone]: true })); // Start loading

      socketRef.current.send(
        JSON.stringify({ event: "approveOtpRequest", phone })
      );

      setTimeout(() => {
        setLoadingActions((prev) => ({ ...prev, [phone]: false })); // Stop loading
        setData((prev) => prev.filter((item) => item.phone !== phone));

        toast({
          description: `✅ OTP request approved for ${phone}`,
        });
      }, 500);
    }
  };

  const rejectOtpRequest = (phone) => {
    setTimeout(() => {
      setLoadingActions((prev) => ({ ...prev, [phone]: false })); // Stop loading
      setData((prev) => prev.filter((item) => item.phone !== phone));

      toast({
        description: `❌ OTP request rejected for ${phone}`,
        variant: "destructive",
      });
    }, 500);
  };

  const filteredData = data.filter(
    (item) =>
      item?.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.message?.toLowerCase().includes(searchQuery.toLowerCase())
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
      cell: ({ row }) => {
        const phone = row.original.phone;
        const isLoading = loadingActions[phone];

        return (
          <div className="flex gap-2">
            <Button
              onClick={() => approveOtpRequest(phone)}
              disabled={isLoading}
              className=" hover:bg-green-500 text-white flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
              Approve
            </Button>
            <Button
              onClick={() => rejectOtpRequest(phone)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-500 text-white flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
              Reject
            </Button>
          </div>
        );
      },
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
