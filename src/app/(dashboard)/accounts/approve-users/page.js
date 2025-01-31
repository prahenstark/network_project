"use client";
import DataTable from "@/components/data-table";
import Navbar from "@/components/navbar";
import Searchbar from "@/components/searchbar";
import ToggleHeader from "@/components/toggle-header";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import Loader from "@/components/loader";
import { CircleCheck } from "lucide-react";
import { CircleX } from "lucide-react";

export default function ApproveUserPage() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy data
  const [data, setData] = useState([
    {
      id: 1,
      sn: 1,
      account: "johndoe",
      nickName: "John",
      email: "john@example.com",
      role: "User",
      status: <CircleX />,
      creationTime: "2024-03-20",
      requestReason: "Need access for project work",
    },
    // Add more dummy data as needed
  ]);

  const handleApprove = (userId) => {
    // Add your approve logic here
    console.log("Approving user:", userId);
  };

  const handleReject = (userId) => {
    // Add your reject logic here
    console.log("Rejecting user:", userId);
  };

  const filteredData = data.filter(
    (item) =>
      item.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nickName.toLowerCase().includes(searchQuery.toLowerCase())
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
      accessorKey: "sn",
      header: "SN",
      cell: ({ row }) => <div className="capitalize">{row.getValue("sn")}</div>,
    },
    {
      accessorKey: "account",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("account")}</div>
      ),
    },
    {
      accessorKey: "nickName",
      header: "Nick Name",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("nickName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "requestReason",
      header: "Request Reason",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("requestReason")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "creationTime",
      header: "Request Time",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("creationTime")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleApprove(row.original.id)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Approve
          </Button>
          <Button
            onClick={() => handleReject(row.original.id)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToggleHeader pageName="Approve Users" className="p-6">
        <div className="flex items-center gap-4">
          <Searchbar
            onChange={(e) => setSearchQuery(e.target.value)}
            displayText="🔍 Account/Email Address"
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
