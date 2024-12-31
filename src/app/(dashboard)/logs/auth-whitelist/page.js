"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { fetchProtectedInfo } from "@/lib/api"; // Ensure this is implemented correctly
import { useToast } from "@/hooks/use-toast";
import AuthWhiteListTable from "@/components/logs/logs-table"; // Assuming you'll reuse the same table component
import { useLogDevice } from "@/context/log-device-provider";

export default function AuthWhiteList() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [authWhiteListData, setAuthWhiteListData] = useState([]); // State for Auth White List data
  const [filteredWhiteList, setFilteredWhiteList] = useState([]); // State for filtered white list data
  const [loading, setLoading] = useState(false); // Loading state for Auth White List data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchAuthWhiteList() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/auth-white-list/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        const whiteList = data.response.white_list || [];
        setAuthWhiteListData(whiteList);
        setFilteredWhiteList(whiteList); // Initialize filtered white list data
      } catch (error) {
        setAuthWhiteListData([]);
        console.error("Error fetching auth white list:", error);
        toast({
          description: "Failed to fetch Auth White List data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAuthWhiteList();
  }, [selectedLogDevice]);

  // Filter auth white list data based on the search query
  useEffect(() => {
    const filtered = authWhiteListData.filter((entry) =>
      entry.WebAuthAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWhiteList(filtered);
  }, [searchQuery, authWhiteListData]);

  const columns = [
    { header: "WebAuth Address", accessorKey: "WebAuthAddress" },
  ];

  if (loading) {
    return <div>Loading devices...</div>;
  }

  if (!selectedLogDevice) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <AuthWhiteListTable
        columns={columns}
        rawData={filteredWhiteList}
        loading={loading}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
