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

export default function ConnectionSummary() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [connectionSummaryData, setConnectionSummaryData] = useState([]); // State for connection summary data
  const [filteredSummary, setFilteredSummary] = useState([]); // State for filtered summary data
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingSummary, setLoadingSummary] = useState(false); // Loading state for connection summary data
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

    async function fetchConnectionSummary() {
      setLoadingSummary(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/connection-summary/${selectedDevice}?pageSize=10&pageNo=1`
        );
        const summary = data.response.trace_info_array || [];
        setConnectionSummaryData(summary);
        setFilteredSummary(summary); // Initialize filtered summary
      } catch (error) {
        console.error("Error fetching connection summary:", error);
        toast({
          description: "Failed to fetch connection summary.",
          variant: "destructive",
        });
      } finally {
        setLoadingSummary(false);
      }
    }

    fetchConnectionSummary();
  }, [selectedDevice]);

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

  if (!devices.length) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <div className="flex max-md:flex-col items-center justify-center md:justify-end gap-4 mb-4">
        <Input
          className="max-w-sm bg-green-900/40"
          placeholder="Search Connection Summary..."
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

      <ConnectionSummaryTable
        columns={columns}
        rawData={filteredSummary}
        loading={loadingSummary}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
