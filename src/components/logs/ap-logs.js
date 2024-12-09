"use client";

import { Input } from "../ui/input";
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
import AllUserDataTable from "../app-auth/all-user-table";
import ApLogsTable from "./ap-logs-table";

export default function ApLogs({}) {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [apLogsData, setApLogsData] = useState([]); // State for guest users
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state for guest users
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [selectedAuthType, setSelectedAuthType] = useState("all"); // State for the selected authType filter
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

  // Fetch guest users for the selected device
  useEffect(() => {
    if (!selectedDevice) return;

    async function fetchApLogs() {
      setLoadingUsers(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/ap-logs/${selectedDevice}?pageSize=10&pageNo=1`
        );
        setApLogsData(data.response.log_array || []); // Adjusted to match the new JSON structure
        
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

  const columns = [
    { header: "Time", accessorKey: "Time" },
    { header: "Type", accessorKey: "Type" },
    {
      header: "Info",
      accessorKey: "Info",
    },
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
        {/* Search Input */}
        <Input
          className="max-w-sm bg-green-900/40"
          placeholder="Search Users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Device Select Component */}
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

        {/* Auth Type Filter */}
        {/* <div className="md:min-w-48 max-md:w-full">
          <Select value={selectedAuthType} onValueChange={setSelectedAuthType}>
            <SelectTrigger className="max-w-sm bg-green-900/40">
              <SelectValue placeholder="Filter by Auth Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span className="flex py-1 gap-2 items-center">
                  <UserIcon size={20} /> All
                </span>
              </SelectItem>
              <SelectItem value="auth">
                <span className="flex py-1 gap-2 items-center">
                  <LockIcon size={20} /> Auth
                </span>
              </SelectItem>
              <SelectItem value="sms">
                <span className="flex py-1 gap-2 items-center">
                  <MailIcon size={20} /> SMS
                </span>
              </SelectItem>
              <SelectItem value="coupon">
                <span className="flex py-1 gap-2 items-center">
                  <TicketIcon size={20} /> Coupon
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* User Data Table */}
      <ApLogsTable
        columns={columns}
        rawData={apLogsData}
        loading={loadingUsers}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
