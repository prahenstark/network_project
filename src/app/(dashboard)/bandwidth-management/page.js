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
import BandwidthControlModal from "../../../components/bandwidth-management/bandwidth-control-modal";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";

export default function BandwidthManagement({}) {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [bandwidthData, setBandwidthData] = useState([]); // State for guest users
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows
  const { selectedBandwidthDevice } = useBandwidthDevice();
  const { toast } = useToast();

  // Fetch guest users for the selected device
  useEffect(() => {
    if (!selectedBandwidthDevice) return;

    async function fetchApLogs() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/bandwidth-rules/${selectedBandwidthDevice}?pageSize=10&pageNo=1`
        );
        setBandwidthData(data.response.BAND_CONTROL_RULE_array || []);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching logs:", error);
        toast({
          description: "Failed to fetch logs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchApLogs();
  }, [selectedBandwidthDevice]);

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

  if (!selectedBandwidthDevice) {
    return <div>No devices available.</div>;
  }

  return (
    <div>
      <div>
        {/* <div className="flex max-md:flex-col items-center justify-center md:justify-end gap-4 p-6">
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
        </div> */}
        <BandwidthTable
          columns={columns}
          rawData={bandwidthData}
          loading={loading}
          expandedRows={expandedRows}
          setExpandedRows={setExpandedRows}
        />
      </div>
    </div>
  );
}
