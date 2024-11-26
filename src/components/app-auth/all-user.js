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
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(""); // State for selected device
  const [guestUsers, setGuestUsers] = useState([]); // State for guest users
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state for guest users
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const { toast } = useToast();

  // Fetch devices on component mount
  useEffect(() => {
    async function fetchDevices() {
      try {
        const data = await fetchProtectedInfo("/devices/gateway-device"); // API endpoint
        const deviceList = data.gateways || []; // Assuming 'gateways' is the correct property
        setDevices(deviceList);
        if (deviceList.length > 0) {
          setSelectedDevice(deviceList[0].deviceId); // Set the first device as the default
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast({ description: "Failed to fetch devices.", variant: "destructive" });
      } finally {
        setLoading(false); // Stop loading devices
      }
    }

    fetchDevices();
  }, []);

  // Fetch guest users when selectedDevice changes
  useEffect(() => {
    if (!selectedDevice) return; // Do nothing if no device is selected

    async function fetchGuestUsers() {
      setLoadingUsers(true); // Start loading users
      try {
        const data = await fetchProtectedInfo(`/devices/guest-users/${selectedDevice}`); // API endpoint
        if (data && data.response) {
          setGuestUsers(data.response.userobj_array || []); // Assuming the data structure
        } else {
          toast({
            description: "No guest users found for this device.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching guest users:", error);
        toast({
          description: "Failed to fetch guest users.",
          variant: "destructive",
        });
      } finally {
        setLoadingUsers(false); // Stop loading users
      }
    }

    fetchGuestUsers();
  }, [selectedDevice]);

  // Filter guest users based on the search query
  const filteredUsers = guestUsers.filter((user) =>
    user.Name.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
  );

  // Define table columns
  const columns = [
    { header: "Name", accessorKey: "Name" },
    { header: "Auth Info", accessorKey: "AuthInfo" },
    { header: "Department", accessorKey: "Department" },
    { header: "Policy Level", accessorKey: "PolicyLevel" },
    { header: "MAC Address", accessorKey: "Mac" },
    { header: "Device IP", accessorKey: "DeviceIP" },
    {
      header: "Create Time",
      accessorKey: "CreateTime",
      cell: (info) => new Date(info.getValue() * 1000).toLocaleString(),
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
      <div className="flex max-md:flex-col items-center justify-end gap-4 mb-4">
        {/* Search Input */}
        <Input
          className="max-w-sm bg-green-900/40"
          placeholder="Search Users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />

        {/* Device Select Component */}
        <div className="md:min-w-64 max-md:w-full">
          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="max-w-sm bg-green-900/40">
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device._id} value={device.deviceId}>
                  {device.deviceId}
                </SelectItem>
              ))}
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
