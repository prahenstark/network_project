"use client";

import BandwidthControlModal from "@/components/bandwidth-management/bandwidth-control-modal";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBandwidthDevice } from "@/context/bandwidth-device-provider";
import { useLogDevice } from "@/context/log-device-provider";
import { useToast } from "@/hooks/use-toast";
import { fetchProtectedInfo } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BandwidthList({ children }) {
  const tabs = [
    { key: "bandwidth", label: "Bandwidth", link: "/bandwidth-management" },
    { key: "flow", label: "Flow", link: "/bandwidth-management/flow" },
    {
      key: "source-ip",
      label: "Source IP",
      link: "/bandwidth-management/source-ip",
    },
    {
      key: "destination-ip",
      label: "Destination IP",
      link: "/bandwidth-management/destination-ip",
    },
    {
      key: "department",
      label: "Department",
      link: "/bandwidth-management/department",
    },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [selectedDevice, setSelectedDevice] = useState(""); // Currently selected device
  const [devices, setDevices] = useState([]); // State for all devices
  const { setSelectedBandwidthDevice } = useBandwidthDevice();
  const { selectedBandwidthDevice } = useBandwidthDevice();

  // Fetch devices on component mount
  useEffect(() => {
    async function fetchDevices() {
      try {
        const data = await fetchProtectedInfo("/devices/gateway-device");
        const deviceList = data.gateways || [];
        setDevices(deviceList);
        if (deviceList.length > 0) {
          setSelectedDevice(deviceList[0].deviceId); // Default to the first device
          setSelectedBandwidthDevice(deviceList[0].deviceId);
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        toast({
          description: "Failed to fetch devices.",
          variant: "destructive",
        });
      }
    }

    fetchDevices();
  }, []);

  // Determine the active tab based on the current route
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.link === pathname);
    if (currentTab) {
      setActiveTab(currentTab.key);
    } else {
      setActiveTab(tabs[0].key);
    }
  }, [pathname]);

  // // Fetch system logs for the selected device
  // useEffect(() => {
  //   if (!selectedDevice) return;

  //   async function fetchSystemLogs() {
  //     setLoadingLogs(true);
  //     try {
  //       const data = await fetchProtectedInfo(
  //         `/devices/system-logs/${selectedDevice}?pageSize=10&pageNo=1`
  //       );
  //       setSystemLogsData(data.response.log_array || []);
  //     } catch (error) {
  //       console.error("Error fetching logs:", error);
  //       toast({
  //         description: "Failed to fetch logs.",
  //         variant: "destructive",
  //       });
  //     } finally {
  //       setLoadingLogs(false);
  //     }
  //   }

  //   fetchSystemLogs();
  // }, [selectedDevice]);

  return (
    <div>
      <Navbar title="Bandwidth Management" />
      <div className="flex flex-col m-6">
        <div className="flex max-md:flex-col items-center justify-center md:justify-end gap-4 mb-4">
          <BandwidthControlModal activeTab={activeTab} />
          <Input
            className="max-w-sm bg-green-900/40"
            placeholder="Search Logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="md:min-w-48 max-md:w-full">
            <Select
              value={selectedBandwidthDevice}
              onValueChange={setSelectedBandwidthDevice}
            >
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
        {/* Tabs */}
        <div className="flex space-x-4 overflow-x-scroll pb-4 border-b border-gray-700 hide-scrbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(tab.link)}
              className={`py-2 px-4 rounded-md whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-green-600/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
