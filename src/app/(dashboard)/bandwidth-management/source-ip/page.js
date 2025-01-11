"use client";

import { useEffect, useState } from "react";
import { fetchProtectedInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import FreeflowTable from "@/components/bandwidth-management/freeflow-table";

export default function SourceIp({}) {
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
          `/devices/address-object/${selectedBandwidthDevice}`
        );
        const rawAddressObjArray = data?.response?.addressobj_array || [];

        // Process and transform data for the table
        const transformedData = rawAddressObjArray.map((item) => ({
          Name: item.Name,
          AddressObjCount: item.AddressObjCount, // Using AddressObjCount as an example
          StartIP: item.address_array.map((addr) => `${addr.StartIP}`),
          EndIP: item.address_array.map((addr) => `${addr.EndIP}`),
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
    { header: "Name", accessorKey: "Name" },
    { header: "Address Object Count", accessorKey: "AddressObjCount" },
    { header: "Start IP", accessorKey: "StartIP" },
    { header: "End IP", accessorKey: "EndIP" },
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
