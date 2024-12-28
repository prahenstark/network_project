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
import ConnectionSummaryTable from "@/components/logs/logs-table"; // Assuming you'll reuse the same table component
import { useLogDevice } from "@/context/log-device-provider";

export default function ConnectionSummary() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [connectionSummaryData, setConnectionSummaryData] = useState([]); // State for connection summary data
  const [filteredSummary, setFilteredSummary] = useState([]); // State for filtered summary data
  const [loading, setLoading] = useState(false); // Loading state for connection summary data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchConnectionSummary() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/connection-summary/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        const summary = data.response.trace_info_array || [];
        setConnectionSummaryData(summary);
        setFilteredSummary(summary); // Initialize filtered summary
      } catch (error) {
        setConnectionSummaryData([]);
        console.error("Error fetching connection summary:", error);
        toast({
          description: "Failed to fetch connection summary.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConnectionSummary();
  }, [selectedLogDevice]);

  // Filter connection summary based on the search query
  useEffect(() => {
    const filtered = connectionSummaryData.filter(
      (summary) =>
        summary.TraceInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(summary.Time).includes(searchQuery)
    );
    setFilteredSummary(filtered);
  }, [searchQuery, connectionSummaryData]);

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
      <ConnectionSummaryTable
        columns={columns}
        rawData={filteredSummary}
        loading={loading}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
