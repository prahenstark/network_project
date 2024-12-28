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
import ApLogsTable from "@/components/logs/logs-table";
import { useLogDevice } from "@/context/log-device-provider";

export default function ApLogs() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [apLogsData, setApLogsData] = useState([]); // State for AP logs
  const [filteredLogs, setFilteredLogs] = useState([]); // State for filtered logs
  const [loading, setLoading] = useState(false); // Loading state for logs
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  // useEffect(() => {
  //   async function fetchDevices() {
  //     try {
  //       const data = await fetchProtectedInfo("/devices/gateway-device");
  //       const deviceList = data.gateways || [];
  //       setDevices(deviceList);
  //       if (deviceList.length > 0) {
  //         setSelectedDevice(deviceList[0].deviceId); // Default to the first device
  //       }
  //     } catch (error) {
  //       console.error("Error fetching devices:", error);
  //       toast({
  //         description: "Failed to fetch devices.",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchDevices();
  // }, []);

  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchApLogs() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/ap-logs/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        const logs = data.response.log_array || [];
        setApLogsData(logs);
        setFilteredLogs(logs); // Initialize filtered logs
      } catch (error) {
        setApLogsData([]);
        console.error("Error fetching logs:", error);
        toast({
          description: "Failed to fetch logs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchApLogs();
  }, [selectedLogDevice]);

  // Filter logs based on the search query
  useEffect(() => {
    const filtered = apLogsData.filter(
      (log) =>
        log.Info.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(log.Time).includes(searchQuery)
    );
    setFilteredLogs(filtered);
  }, [searchQuery, apLogsData]);

  const columns = [
    { header: "Time", accessorKey: "Time" },
    { header: "Type", accessorKey: "Type" },
    { header: "Info", accessorKey: "Info" },
  ];

  if (loading) {
    return <div>Loading logs...</div>;
  }

  if (!selectedLogDevice) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <ApLogsTable
        columns={columns}
        rawData={filteredLogs}
        loading={loading}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
