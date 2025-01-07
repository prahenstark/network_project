"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { fetchProtectedInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ApLogsTable from "@/components/logs/logs-table";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/navbar";
import BandwidthTable from "@/components/bandwidth-management/bandwidth-table";
import { ChevronRight } from "lucide-react";
import BandwidthControlModal from "./bandwidth-modal";

export default function BandwidthManagement({}) {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [bandwidthData, setBandwidthData] = useState([]); // State for guest users
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [loadingUsers, setLoadingUsers] = useState(false); // Loading state for guest users
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows
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
          `/devices/bandwidth-rules/${selectedDevice}?pageSize=10&pageNo=1`
        );
        setBandwidthData(data.response.BAND_CONTROL_RULE_array || []);
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

  const toggleRowExpansion = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const columns = [
    { header: "Name", accessorKey: "Name" },
    { header: "Address", accessorKey: "Address" },
    { header: "Enabled", accessorKey: "Enabled" },
    { header: "Schedule", accessorKey: "Schedule" },
    { header: "AddrType", accessorKey: "AddrType" },
    {
      header: "Object",
      accessorKey: "Obj",
      cell: ({ row }) => {
        const isExpanded = expandedRows.includes(row.index);
        return (
          <div>
            <button
              onClick={() => toggleRowExpansion(row.index)}
              className="flex items-center text-green-500"
            >
              <span
                className={`transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              >
                <ChevronRight />
              </span>
              <span className="ml-2 ">Details</span>
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return <div>Loading logs...</div>;
  }


  return (
    <div>
      <Navbar title="Bandwidth Management" />
      <div>
        <div className="flex max-md:flex-col items-center justify-center md:justify-end gap-4 p-6">
          <BandwidthControlModal>Open</BandwidthControlModal>
          <Input
            className="max-w-sm bg-green-900/40"
            placeholder="Search Users..."
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
        <BandwidthTable
          columns={columns}
          rawData={bandwidthData}
          loading={loadingUsers}
          expandedRows={expandedRows}
          setExpandedRows={setExpandedRows}
        />
      </div>
    </div>
  );
}
