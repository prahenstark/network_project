"use client";
import DataTable from "@/components/data-table";
import IconDropdown from "@/components/icon-dropdown";
import Navbar from "@/components/navbar";
import Searchbar from "@/components/searchbar";
import SelectDropdown from "@/components/select-dropdown";
import ToggleHeader from "@/components/toggle-header";
import { FileInput } from "lucide-react";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { fetchDashboardInfo } from "@/lib/api";
import CreateAccountModal from "@/components/accounts/create-account-modal";
import ResetAccountModal from "@/components/accounts/reset-account-modal";
import DeleteAccountModal from "@/components/accounts/delete-account-modal";
import Loader from "@/components/loader";
import { CircleCheck } from "lucide-react";
import { CircleX } from "lucide-react";

export default function AccountsPage() {
  const [selectediconDropdownOption, setSelectediconDropdownOption] =
    useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (option) => {
    setSelectediconDropdownOption(option);
    setIsModalOpen(true); // Set the selected option directly
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectediconDropdownOption(null);
  };

  const iconDropdownOptions = [
    "Create Account",
    "Reset Account",
    "Delete Account",
  ];

  const iconDropdownContent = {
    "Create Account": (
      <CreateAccountModal isOpen={isModalOpen} onClose={closeModal} />
    ),
    "Reset Account": (
      <ResetAccountModal
        gids={selectedIds}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    ),
    "Delete Account": (
      <DeleteAccountModal
        gids={selectedIds}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    ),
  };

  const dropdownOptions = [
    { label: "All", value: "all" },
    { label: "Test 1", value: "test1" },
    { label: "Test 2", value: "test2" },
    { label: "Test 3", value: "test3" },
  ];

  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows

  useEffect(() => {
    const fetchData = async () => {
      const path = "/account?pageOffset=10&pageIndex=1&status=2";
      try {
        setLoading(true); // Start loading
        const response = await fetchDashboardInfo(path);
        console.log("Response:", response);
        const transformedData = response.users.map((user, index) => ({
          id: user.uid,
          sn: index + 1,
          account: user.username,
          nickName: user.nickname,
          email: user.email,
          role: "User", // Assuming role is "User"; adjust if role data is available
          status: user.status === "1" ? <CircleCheck /> : <CircleX />, // Assuming status mapping
          creationTime: user.created_at,
          projects: user.projects || [], // Projects data
        }));
        setData(transformedData);
      } catch (error) {
        console.log("Error transforming data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nickName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowExpansion = (rowIndex) => {
    setExpandedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((index) => index !== rowIndex)
        : [...prev, rowIndex]
    );
  };

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
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            // Update the selected IDs state
            if (value) {
              // If the row is selected, add the ID to the selectedIds state
              setSelectedIds((prev) => [...prev, row.original.id]);
            } else {
              // If the row is deselected, remove the ID from the selectedIds state
              setSelectedIds((prev) =>
                prev.filter((id) => id !== row.original.id)
              );
            }
          }}
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
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("role")}</div>
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
      id: "projects",
      header: "Projects",
      cell: ({ row }) => {
        const isExpanded = expandedRows.includes(row.index);
        return (
          <div>
            <button onClick={() => handleRowExpansion(row.index)}>
              {isExpanded ? "Hide Projects" : "Show Projects"}
            </button>
            {isExpanded && (
              <div className="mt-2">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="border border-green-800 px-4">Name</th>
                      <th className="border border-green-800 px-4">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.original.projects.map((project) => (
                      <tr key={project.projectId}>
                        <td className="border border-green-800 px-4">
                          {project.name}
                        </td>
                        <td className="border border-green-800 px-4">
                          {project.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "creationTime",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Creation Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("creationTime")}</div>
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
              {/* <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button> */}
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
    <>
      <ToggleHeader pageName="Account List" className="p-6">
        <div className="flex items-center max-md:flex-col gap-4">
          <div className="flex items-center gap-4">
            <SelectDropdown
              className="min-w-28"
              options={dropdownOptions}
              disabled={true}
            />
            <SelectDropdown
              className="min-w-28"
              options={dropdownOptions}
              disabled={true}
            />
          </div>
          <div className="flex items-center gap-4">
            <Searchbar
              onChange={(e) => setSearchQuery(e.target.value)}
              displayText="🔍 Account/Email Address"
            />
            <IconDropdown
              className="border-green-500 min-w-20"
              options={iconDropdownOptions}
              onSelect={handleSelect}
            >
              <FileInput size={18} />
              <ChevronDown size={18} />
            </IconDropdown>
          </div>
        </div>
      </ToggleHeader>

      <div className="max-md:h-24"></div>

      {selectediconDropdownOption && (
        <div className="">
          {iconDropdownContent[selectediconDropdownOption]}
        </div>
      )}

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
