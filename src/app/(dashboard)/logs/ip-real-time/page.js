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
import { useLogDevice } from "@/context/log-device-provider";

export default function IpRealTimeStream() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [ipStreamData, setIpStreamData] = useState([]); // State for IP stream data
  const [filteredStream, setFilteredStream] = useState([]); // State for filtered stream data
  const [loading, setLoading] = useState(false); // Loading state for IP stream data
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchIpStreamData() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/ip-real-stream/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        const stream = data.response.ip_realtime_array || [];
        setIpStreamData(stream);
        setFilteredStream(stream); // Initialize filtered stream
      } catch (error) {
        setIpStreamData([]);
        console.error("Error fetching IP stream data:", error);
        toast({
          description: "Failed to fetch IP real-time stream data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchIpStreamData();
  }, [selectedLogDevice]);

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

  if (!selectedLogDevice) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <IpRealTimeStreamTable
        columns={columns}
        rawData={filteredStream}
        loading={loading}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
