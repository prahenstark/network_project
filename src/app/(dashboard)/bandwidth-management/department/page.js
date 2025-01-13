"use client";

import { useEffect, useState } from "react";
import { fetchProtectedInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import FreeflowTable from "@/components/bandwidth-management/freeflow-table";

export default function Department({}) {
  const [bandwidthData, setBandwidthData] = useState([]); // State for guest users
  const [loading, setLoading] = useState(true); // Loading state for devices
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [expandedRows, setExpandedRows] = useState([]); // Track expanded rows
  const { selectedBandwidthDevice } = useBandwidthDevice();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedBandwidthDevice) return;

    async function fetchApLogs() {
      setLoading(true);
      try {
        const data = await fetchProtectedInfo(
          `/devices/get-department/${selectedBandwidthDevice}`
        );
        setBandwidthData(data?.response?.department_array || []);
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


  const columns = [{ header: "Name", accessorKey: "Name" }];

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
