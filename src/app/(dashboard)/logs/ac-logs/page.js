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
import { fetchProtectedInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ApLogsTable from "@/components/logs/logs-table";
import { useLogDevice } from "@/context/log-device-provider";

export default function AcLogs() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // Currently selected device
  const [acLogsData, setAcLogsData] = useState([]); // Logs data
  const [loading, setLoading] = useState(false); // Loading state for logs
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  // Fetch devices on component mount
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

  // Fetch logs for the selected device
  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchApLogs() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/ac-logs/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        setAcLogsData(data.response.log_array || []);
      } catch (error) {
        setAcLogsData([]);
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

  // Define table columns
  const columns = [
    { header: "Time", accessorKey: "Time" },
    { header: "Type", accessorKey: "Type" },
    { header: "Info", accessorKey: "Info" },
  ];

  if (loading) {
    return <div>Loading devices...</div>;
  }

  if (!selectedLogDevice) {
    return <div>No devices available.</div>;
  }

  // Filter logs based on the search query
  const filteredLogs = acLogsData.filter((log) =>
    log.Info.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
