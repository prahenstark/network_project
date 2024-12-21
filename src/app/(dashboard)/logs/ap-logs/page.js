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

export default function ApLogs() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [apLogsData, setApLogsData] = useState([]); // State for AP logs
  const [filteredLogs, setFilteredLogs] = useState([]); // State for filtered logs
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state for logs
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { toast } = useToast();

  useEffect(() => {
    async function fetchDevices() {
      try {
        const data = await fetchProtectedInfo("/devices/gateway-device");
        const deviceList = data.gateways || [];
        setDevices(deviceList);
        if (deviceList.length > 0) {
          setSelectedDevice(deviceList[0].deviceId); // Default to the first device
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast({
          description: "Failed to fetch devices.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;

    async function fetchApLogs() {
      setLoadingUsers(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/ap-logs/${selectedDevice}?pageSize=10&pageNo=1`
        );
        const logs = data.response.log_array || [];
        setApLogsData(logs);
        setFilteredLogs(logs); // Initialize filtered logs
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast({
          description: "Failed to fetch logs.",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchApLogs();
  }, [selectedDevice]);

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

  if (!devices.length) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <div className="flex max-md:flex-col items-center justify-center md:justify-end gap-4 mb-4">
        <Input
          className="max-w-sm bg-green-900/40"
          placeholder="Search AP Logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="md:min-w-48 max-md:w-full">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="max-w-sm bg-green-900/40">
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.deviceId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ApLogsTable
        columns={columns}
        rawData={filteredLogs}
        loading={loadingUsers}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
