"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { fetchProtectedInfo } from "@/lib/api"; // Import the fetchProtectedInfo function
import { useToast } from "@/hooks/use-toast";

export default function SMSBasedForm() {
  const [devices, setDevices] = useState([]);
  const [mobile, setMobile] = useState(""); // State for mobile number
  const [selectedDevice, setSelectedDevice] = useState(""); // State for selected device
  const [selectedSMSType, setSelectedSMSType] = useState("closed"); // State for SMS type
  const [usageHours, setUsageHours] = useState(""); // State for number of hours
  const { toast } = useToast();

  // Fetch devices on component mount
  useEffect(() => {
    async function fetchDevices() {
      try {
        const data = await fetchProtectedInfo("/devices/gateway-device"); // Use fetchProtectedInfo to fetch devices
        setDevices(data.gateways || []); // Assuming 'gateways' is the correct property
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    }

    fetchDevices();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the API call
    const payload = {
      // deviceId: selectedDevice,
      mobile: mobile,
      authType: "sms",
      selectedSMSType: "closed",
      // ...(selectedSMSType === "open"
      //   ? { usageHours }
      //   : { mobile }),
    };

    try {
      const response = await fetchProtectedInfo(
        `/devices/add-guest/${selectedDevice}`,
        "PUT",
        payload
      );

      if (response) {
        toast({ description: "Guest added successfully" });
        setMobile("");
        setUsageHours("");
        setSelectedDevice("");
      } else {
        toast({ description: "Failed to add guest", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error during PUT request:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-6 border rounded-lg shadow-md w-96 space-y-4 bg-background">
        <h2 className="text-center text-lg font-bold">
          SMS Based Login Method
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
          {/* <div>
            <Label className="block mb-2">Select SMS Type</Label>
            <Select required value={selectedSMSType} onValueChange={setSelectedSMSType}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of SMS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open SMS</SelectItem>
                <SelectItem value="closed">Closed SMS</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          {selectedSMSType === "open" ? (
            <div>
              <Label className="block mb-2">Usage Hours</Label>
              <Input
                type="number"
                value={usageHours}
                onChange={(e) => setUsageHours(e.target.value)}
                placeholder="Enter number of hours"
              />
            </div>
          ) : (
            <div>
              <Label className="block mb-2">Phone</Label>
              <Input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          )}
          <Button className="w-full" type="submit">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}
