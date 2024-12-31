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
import AppFlowTable from "@/components/logs/logs-table"; // Assuming you'll reuse the same table component
import { useLogDevice } from "@/context/log-device-provider";

export default function AppFlow() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [appFlowData, setAppFlowData] = useState([]); // State for Application Flow data
  const [filteredFlow, setFilteredFlow] = useState([]); // State for filtered flow data
  const [loading, setLoading] = useState(false); // Loading state for Application flow data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchAppFlowData() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/app-flow/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        const flow = data.response.l7_realtime_array || [];
        setAppFlowData(flow);
        setFilteredFlow(flow); // Initialize filtered flow data
      } catch (error) {
        setAppFlowData([]);
        console.error("Error fetching app flow data:", error);
        toast({
          description: "Failed to fetch application flow data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAppFlowData();
  }, [selectedLogDevice]);

  // Filter application flow data based on the search query
  useEffect(() => {
    const filtered = appFlowData.filter(
      (flow) =>
        String(flow.AppId).includes(searchQuery) ||
        String(flow.SndBytes).includes(searchQuery) ||
        String(flow.RcvBytes).includes(searchQuery)
    );
    setFilteredFlow(filtered);
  }, [searchQuery, appFlowData]);

  const columns = [
    { header: "App ID", accessorKey: "AppId" },
    { header: "Send Rate", accessorKey: "SendRate" },
    { header: "Receive Rate", accessorKey: "RecvRate" },
    { header: "Sent Bytes", accessorKey: "SndBytes" },
    { header: "Received Bytes", accessorKey: "RcvBytes" },
  ];

  if (loading) {
    return <div>Loading devices...</div>;
  }

  if (!selectedLogDevice) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <AppFlowTable
        columns={columns}
        rawData={filteredFlow}
        loading={loading}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
