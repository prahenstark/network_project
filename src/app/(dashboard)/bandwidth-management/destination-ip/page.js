"use client";

import { useEffect, useState } from "react";
import { fetchProtectedInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import FreeflowTable from "@/components/bandwidth-management/freeflow-table";
import DestinationIPTable from "@/components/bandwidth-management/destination-ip-table";

export default function DestinationIp({}) {
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
          `/devices/get-destination-ip/${selectedBandwidthDevice}`
        );
        const rawAddressObjArray = data?.response?.isp_array || [];

        // Process and transform data for the table
        const transformedData = rawAddressObjArray.map((item) => ({
          IspId: item.IspId,
          Name: item.Name,
          Description: item.ZH_Desc,
          RouteCount: item.RouteCount, // Using AddressObjCount as an example
          Net: item.RouteTable.map((addr) => `${addr.Net}`),
          Mask: item.RouteTable.map((addr) => `${addr.Mask}`),
        }));

        setBandwidthData(transformedData);
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

  const columns = [
    { header: "ISP ID", accessorKey: "IspId" },
    { header: "Name", accessorKey: "Name" },
    { header: "Description", accessorKey: "Description" },
    { header: "Route Count", accessorKey: "RouteCount" },
    { header: "Net", accessorKey: "Net", isExpandable: true },
    { header: "Mask", accessorKey: "Mask", isExpandable: true },
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
        <DestinationIPTable
          columns={columns}
          rawData={bandwidthData}
          loading={loading}
        />
      </div>
    </div>
  );
}
