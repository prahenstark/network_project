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
import ConnectionListTable from "@/components/logs/logs-table"; // Assuming you'll reuse the same table component
import { useLogDevice } from "@/context/log-device-provider";

export default function ConnectedList() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [connectionListData, setConnectionListData] = useState([]); // State for connection list data
  const [filteredConnections, setFilteredConnections] = useState([]); // State for filtered connection list
  const [loading, setLoading] = useState(false); // Loading state for connection data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchConnectionList() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/connection-list/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        const connections = data.response.trace_info_array || [];
        setConnectionListData(connections);
        setFilteredConnections(connections); // Initialize filtered connections
      } catch (error) {
        setConnectionListData([]);
        console.error("Error fetching connection list:", error);
        toast({
          description: "Failed to fetch connection list.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConnectionList();
  }, [selectedLogDevice]);

  // Filter connection list based on the search query
  useEffect(() => {
    const filtered = connectionListData.filter(
      (connection) =>
        connection.TraceInfo.toLowerCase().includes(
          searchQuery.toLowerCase()
        ) || String(connection.Time).includes(searchQuery)
    );
    setFilteredConnections(filtered);
  }, [searchQuery, connectionListData]);

  const columns = [
    { header: "Time", accessorKey: "Time" },
    { header: "Trace Info", accessorKey: "TraceInfo" },
    { header: "Type", accessorKey: "Type" },
  ];

  if (loading) {
    return <div>Loading devices...</div>;
  }

  if (!selectedLogDevice) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <ConnectionListTable
        columns={columns}
        rawData={filteredConnections}
        loading={loading}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
