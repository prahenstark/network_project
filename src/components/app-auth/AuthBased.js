"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { fetchProtectedInfo } from "@/lib/api"; // Import your fetchDashboardInfo function
import { PasswordInput } from "../ui/password";
import { useToast } from "@/hooks/use-toast";

export default function AuthBasedForm() {
  const [devices, setDevices] = useState([]);
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [selectedDevice, setSelectedDevice] = useState(""); // State for selected device
  const { toast } = useToast();

  // Fetch devices on component mount
  useEffect(() => {
    async function fetchDevices() {
      try {
        const data = await fetchProtectedInfo("/devices/gateway-device"); // Use fetchProtectedInfo here
        setDevices(data.gateways || []); // Assuming 'gateways' is the correct property
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    }

    fetchDevices();
  }, []);

  // Handle form submission using fetchProtectedInfo
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the API call
    const payload = {
      username,
      password,
      deviceId: selectedDevice,
    };

    try {
      const response = await fetchProtectedInfo(
        `/devices/add-guest/${selectedDevice}`,
        "PUT",
        payload
      );

      if (response) {
        toast({description: "Guest added successfully"});
        setUsername("");
        setPassword("");
        setSelectedDevice("");
      } else {
        console.error("Error adding guest");
      }
    } catch (error) {
      console.error("Error during PUT request:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-6 border rounded-lg shadow-md w-96 space-y-4 bg-background">
        <h2 className="text-center text-lg font-bold">
          Auth Based Login Method
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="block mb-2">Select Device</Label>
            <Select value={selectedDevice} onValueChange={setSelectedDevice}>
              <SelectTrigger>
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
          <div>
            <Label className="block mb-2">Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div>
            <Label className="block mb-2">Password</Label>
            <PasswordInput
              passwordScore={null}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <Button className="w-full" type="submit">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}
