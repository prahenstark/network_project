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
import AuthWhiteListTable from "@/components/logs/logs-table"; // Assuming you'll reuse the same table component

export default function AuthWhiteList() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [authWhiteListData, setAuthWhiteListData] = useState([]); // State for Auth White List data
  const [filteredWhiteList, setFilteredWhiteList] = useState([]); // State for filtered white list data
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingWhiteList, setLoadingWhiteList] = useState(false); // Loading state for Auth White List data
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

    async function fetchAuthWhiteList() {
      setLoadingWhiteList(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/auth-white-list/${selectedDevice}?pageSize=10&pageNo=1`
        );
        const whiteList = data.response.white_list || [];
        setAuthWhiteListData(whiteList);
        setFilteredWhiteList(whiteList); // Initialize filtered white list data
      } catch (error) {
        console.error("Error fetching auth white list:", error);
        toast({
          description: "Failed to fetch Auth White List data.",
          variant: "destructive",
        });
      } finally {
        setLoadingWhiteList(false);
      }
    }

    fetchAuthWhiteList();
  }, [selectedDevice]);

  // Filter auth white list data based on the search query
  useEffect(() => {
    const filtered = authWhiteListData.filter((entry) =>
      entry.WebAuthAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredWhiteList(filtered);
  }, [searchQuery, authWhiteListData]);

  const columns = [
    { header: "WebAuth Address", accessorKey: "WebAuthAddress" },
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
          placeholder="Search Auth White List..."
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

      <AuthWhiteListTable
        columns={columns}
        rawData={filteredWhiteList}
        loading={loadingWhiteList}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
