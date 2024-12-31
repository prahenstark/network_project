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
import { useLogDevice } from "@/context/log-device-provider";

export default function RadioInfo() {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for selected device
  const [radioInfoData, setRadioInfoData] = useState([]); // State for WTP Radio Info data
  const [filteredRadioInfo, setFilteredRadioInfo] = useState([]); // State for filtered radio info data
  const [loading, setLoading] = useState(false); // Loading state for Radio Info
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const { selectedLogDevice } = useLogDevice();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedLogDevice) return;

    async function fetchRadioInfo() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/radio-info/${selectedLogDevice}?pageSize=10&pageNo=1`
        );
        const radioInfo = data.response.wtp_array || [];
        setRadioInfoData(radioInfo);
        setFilteredRadioInfo(radioInfo); // Initialize filtered radio info data
      } catch (error) {
        setRadioInfoData([]);
        console.error("Error fetching radio info:", error);
        toast({
          description: "Failed to fetch WTP Radio Info.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchRadioInfo();
  }, [selectedLogDevice]);

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

  if (!selectedLogDevice) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <RadioInfoTable
        columns={columns}
        rawData={filteredRadioInfo}
        loading={loading}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
    </div>
  );
}
