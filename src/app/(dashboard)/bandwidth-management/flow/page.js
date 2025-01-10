"use client";

import { useEffect, useState } from "react";
import { fetchProtectedInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import FreeflowTable from "@/components/bandwidth-management/freeflow-table";

export default function Flow({}) {
  const [devices, setDevices] = useState([]); // State for all devices
  const [selectedDevice, setSelectedDevice] = useState(""); // State for the currently selected device
  const [bandwidthData, setBandwidthData] = useState([]); // State for guest users
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows
  const { selectedBandwidthDevice } = useBandwidthDevice();
  const { toast } = useToast();

  // Fetch devices on component mount
  // useEffect(() => {
  //   async function fetchDevices() {
  //     try {
  //       const data = await fetchProtectedInfo("/devices/gateway-device");
  //       const deviceList = data.gateways || [];
  //       setDevices(deviceList);
  //       if (deviceList.length > 0) {
  //         setSelectedDevice(deviceList[0].deviceId); // Default to the first device
  //       }
  //     } catch (error) {
  //       console.error("Error fetching devices:", error);
  //       toast({
  //         description: "Failed to fetch devices.",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchDevices();
  // }, []);

  // Fetch guest users for the selected device
  useEffect(() => {
    if (!selectedBandwidthDevice) return;

    async function fetchApLogs() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/get-free-flow-control/${selectedBandwidthDevice}`
        );
        setBandwidthData(data?.response?.exception_array || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching logs:", error);
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
    { header: "Enabled", accessorKey: "Enabled" },
    { header: "Name", accessorKey: "Name" },
    { header: "Source Address Type", accessorKey: "SrcAddrType" },

    { header: "Source Address", accessorKey: "SrcAddress" },
    { header: "Route Table", accessorKey: "RouteTable" },
    { header: "Service", accessorKey: "Service" },
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
        <FreeflowTable
          columns={columns}
          rawData={bandwidthData}
          loading={loading}
        />
      </div>
    </div>
  );
}
