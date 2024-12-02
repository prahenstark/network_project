"use client";

import { Input } from "../ui/input";
import AllUserDataTable from "./all-user-table";
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

export default function AllUsers({}) {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [guestUsers, setGuestUsers] = useState([]); // State for guest users
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
        toast({ description: "Failed to fetch devices.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }

    fetchDevices();
  }, []);

  // Fetch guest users for the selected device
  useEffect(() => {
    if (!selectedDevice) return;

    async function fetchGuestUsers() {
      setLoadingUsers(true);
      try {
        const data = await fetchProtectedInfo(`/devices/guest-users/${selectedDevice}`);
        setGuestUsers(data.guests || []); // Adjusted to match the new JSON structure
      } catch (error) {
        console.error("Error fetching guest users:", error);
        toast({ description: "Failed to fetch guest users.", variant: "destructive" });
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchGuestUsers();
  }, [selectedDevice]);

  // Filter guest users based on the search query and authType
  const filteredUsers = guestUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAuthType =
      selectedAuthType === "all" || user.authType === selectedAuthType;
    return matchesSearch && matchesAuthType;
  });

  // Define table columns to match the guest user data structure
  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "SSID", accessorKey: "ssid" },
    { header: "Password", accessorKey: "password" },
    { header: "Auth Type", accessorKey: "authType" },
    { header: "Coupon Code", accessorKey: "couponCode" },
    {
      header: "Coupon Expiry",
      accessorKey: "couponExpiry",
      cell: (info) =>
        info.getValue()
          ? new Date(parseInt(info.getValue()) * 1000).toLocaleString()
          : "Never", // Format or indicate no expiry
    },
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
        <div className="md:min-w-48 max-md:w-full">
          <Select value={selectedAuthType} onValueChange={setSelectedAuthType}>
            <SelectTrigger className="max-w-sm bg-green-900/40">
              <SelectValue placeholder="Filter by Auth Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="auth">Auth</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="coupon">Coupon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* User Data Table */}
      <AllUserDataTable
        columns={columns}
        rawData={{
          ret: filteredUsers.length ? 0 : 1,
          Count: filteredUsers.length,
          userobj_array: filteredUsers,
        }}
        loading={loadingUsers}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
