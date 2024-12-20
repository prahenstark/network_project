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
import RadioInfoTable from "@/components/logs/logs-table"; // Assuming you have a table component for this

export default function RadioInfo() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for selected device
  const [radioInfoData, setRadioInfoData] = useState([]); // State for WTP Radio Info data
  const [filteredRadioInfo, setFilteredRadioInfo] = useState([]); // State for filtered radio info data
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingRadioInfo, setLoadingRadioInfo] = useState(false); // Loading state for Radio Info
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

    async function fetchRadioInfo() {
      setLoadingRadioInfo(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/radio-info/${selectedDevice}?pageSize=10&pageNo=1`
        );
        const radioInfo = data.response.wtp_array || [];
        setRadioInfoData(radioInfo);
        setFilteredRadioInfo(radioInfo); // Initialize filtered radio info data
      } catch (error) {
        console.error("Error fetching radio info:", error);
        toast({
          description: "Failed to fetch WTP Radio Info.",
          variant: "destructive",
        });
      } finally {
        setLoadingRadioInfo(false);
      }
    }

    fetchRadioInfo();
  }, [selectedDevice]);

  // Filter radio info based on the search query
  useEffect(() => {
    const filtered = radioInfoData.filter((entry) =>
      entry.WtpName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRadioInfo(filtered);
  }, [searchQuery, radioInfoData]);

  const columns = [
    { header: "WTP Name", accessorKey: "WtpName" },
    { header: "WTP IP", accessorKey: "WtpIP" },
    { header: "Status", accessorKey: "status" },
    { header: "Hardware Version", accessorKey: "HwVer" },
    { header: "Software Version", accessorKey: "SwVer" },
    { header: "Location", accessorKey: "Location" },
    { header: "Vendor", accessorKey: "Vendor" },
    { header: "Eth Name", accessorKey: "EthName" },
    { header: "MAC Address", accessorKey: "ManageMac" },
    { header: "Radio Count", accessorKey: "radioCnt" },
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
          placeholder="Search Radio Info..."
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

      <RadioInfoTable
        columns={columns}
        rawData={filteredRadioInfo}
        loading={loadingRadioInfo}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
