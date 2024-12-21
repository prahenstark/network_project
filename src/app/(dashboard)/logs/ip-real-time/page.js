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
import IpRealTimeStreamTable from "@/components/logs/logs-table"; // Assuming you'll reuse the same table component

export default function IpRealTimeStream() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [ipStreamData, setIpStreamData] = useState([]); // State for IP stream data
  const [filteredStream, setFilteredStream] = useState([]); // State for filtered stream data
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingStream, setLoadingStream] = useState(false); // Loading state for IP stream data
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

    async function fetchIpStreamData() {
      setLoadingStream(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/ip-real-stream/${selectedDevice}?pageSize=10&pageNo=1`
        );
        const stream = data.response.ip_realtime_array || [];
        setIpStreamData(stream);
        setFilteredStream(stream); // Initialize filtered stream
      } catch (error) {
        console.error("Error fetching IP stream data:", error);
        toast({
          description: "Failed to fetch IP real-time stream data.",
          variant: "destructive",
        });
      } finally {
        setLoadingStream(false);
      }
    }

    fetchIpStreamData();
  }, [selectedDevice]);

  // Filter IP stream data based on the search query
  useEffect(() => {
    const filtered = ipStreamData.filter(
      (stream) =>
        stream.Ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(stream.Mac).includes(searchQuery)
    );
    setFilteredStream(filtered);
  }, [searchQuery, ipStreamData]);

  const columns = [
    { header: "IP", accessorKey: "Ip" },
    { header: "MAC", accessorKey: "Mac" },
    { header: "Device Type", accessorKey: "DevType" },
    // { header: "Streams", accessorKey: "Streams", customRender: (streams) => streams.length }, //TODO fix streams
    { header: "TCP Count", accessorKey: "TCPCount" },
    { header: "UDP Count", accessorKey: "UDPCount" },
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
          placeholder="Search IP Streams..."
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

      <IpRealTimeStreamTable
        columns={columns}
        rawData={filteredStream}
        loading={loadingStream}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
