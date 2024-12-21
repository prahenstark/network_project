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

export default function AppFlow() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [appFlowData, setAppFlowData] = useState([]); // State for Application Flow data
  const [filteredFlow, setFilteredFlow] = useState([]); // State for filtered flow data
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingFlow, setLoadingFlow] = useState(false); // Loading state for Application flow data
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

    async function fetchAppFlowData() {
      setLoadingFlow(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/app-flow/${selectedDevice}?pageSize=10&pageNo=1`
        );
        const flow = data.response.l7_realtime_array || [];
        setAppFlowData(flow);
        setFilteredFlow(flow); // Initialize filtered flow data
      } catch (error) {
        console.error("Error fetching app flow data:", error);
        toast({
          description: "Failed to fetch application flow data.",
          variant: "destructive",
        });
      } finally {
        setLoadingFlow(false);
      }
    }

    fetchAppFlowData();
  }, [selectedDevice]);

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

  if (!devices.length) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <div className="flex max-md:flex-col items-center justify-center md:justify-end gap-4 mb-4">
        <Input
          className="max-w-sm bg-green-900/40"
          placeholder="Search Application Flow..."
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

      <AppFlowTable
        columns={columns}
        rawData={filteredFlow}
        loading={loadingFlow}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
