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
import LogsTable from "@/components/logs/logs-table";

export default function SystemLogs() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // Currently selected device
  const [systemLogsData, setSystemLogsData] = useState([]); // Logs data
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingLogs, setLoadingLogs] = useState(false); // Loading state for logs
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const { toast } = useToast();

  // Fetch devices on component mount
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

  // Fetch system logs for the selected device
  useEffect(() => {
    if (!selectedDevice) return;

    async function fetchSystemLogs() {
      setLoadingLogs(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/system-logs/${selectedDevice}?pageSize=10&pageNo=1`
        );
        setSystemLogsData(data.response.log_array || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
        toast({
          description: "Failed to fetch logs.",
          variant: "destructive",
        });
      } finally {
        setLoadingLogs(false);
      }
    }

    fetchSystemLogs();
  }, [selectedDevice]);

  // Define table columns
  const columns = [
    { header: "Time", accessorKey: "Time" },
    { header: "Type", accessorKey: "Type" },
    { header: "Info", accessorKey: "Info" },
  ];

  if (loading) {
    return <div>Loading devices...</div>;
  }

  if (!devices.length) {
    return <div>No devices available.</div>;
  }

  // Filter logs based on the search query
  const filteredLogs = systemLogsData.filter((log) =>
    log.Info.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex max-md:flex-col items-center justify-center md:justify-end gap-4 mb-4">
        <Input
          className="max-w-sm bg-green-900/40"
          placeholder="Search Logs..."
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

      <LogsTable
        columns={columns}
        rawData={filteredLogs}
        loading={loadingLogs}
        rowClassName={(index) => (index % 2 === 0 ? "bg-blue-100/5" : "")}
      />
    </div>
  );
}
