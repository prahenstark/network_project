"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ToggleHeader from "@/components/toggle-header";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import DeviceTable from "@/components/devices/device-table";
import Loader from "@/components/loader";
import { fetchDashboardInfo } from "@/lib/api";
import { useDevice } from "@/context/device-context";
import AllDeviceTable from "@/components/all-devices/all-device-table";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input"; // Import Input for search bar

export default function AllDevices() {
  const [loading, setLoading] = useState(true);
  const [allDevicesData, setAllDevicesData] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]); // State for filtered data
  const { selectedDeviceProject } = useDevice();
  const params = useSearchParams();
  const status = params.get("status");
  const [mode, setMode] = useState(status || "all"); // State to manage the selected mode
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const getData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardInfo("/device");
      const devices = data?.DevicePageData?.devices || [];
      const flattenedDevices = flattenDevices(devices);
      setAllDevicesData(flattenedDevices);
      setFilteredDevices(flattenedDevices); // Initialize filtered data
    } catch (error) {
      console.log("Failed to fetch devices data:", error);
    } finally {
      setLoading(false);
    }
  };

  const flattenDevices = (projects) => {
    let devices = [];
    projects.forEach((project) => {
      if (project.deviceList) {
        devices = [...devices, ...project.deviceList];
      }
      if (project.child && project.child.length > 0) {
        devices = [...devices, ...flattenDevices(project.child)];
      }
    });
    return devices;
  };

  useEffect(() => {
    getData();
  }, []);

  // Update filteredDevices based on search query
  useEffect(() => {
    const filtered = allDevicesData.filter((device) =>
      device.ip?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDevices(filtered);
  }, [searchQuery, allDevicesData]);

  const dropdownOptions = [
    { label: "All Devices", value: "all" },
    { label: "Online Devices", value: "online" },
    { label: "Offline Devices", value: "offline" },
  ];

  return (
    <div className="w-full">
      <Navbar title="All Devices" />
      <div className="md:flex flex-1 min-w-full">
        <div className="flex flex-col min-w-full overflow-x-auto max-md:mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          ) : (
            <>
              <div
                className={`flex max-lg:mb-28 max-lg:flex-col lg:items-center justify-between rounded-md shadow-sm max-h-16 w-full p-6`}
              >
                {/* Left: Page Name */}
                <h2 className="text-lg font-semibold ">All Devices</h2>

                {/* Right: Placeholder for Control Buttons */}
                <div className="flex max-lg:flex-wrap max-lg:mt-4 gap-4">
                  <div className="lg:min-w-96">
                    <Input
                      type="text"
                      placeholder="Search by IP Address"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white bg-opacity-5 w-full"
                    />
                  </div>

                  <div className="lg:min-w-48">
                    <Select
                      value={mode}
                      onValueChange={setMode} // Update state on change
                    >
                      <SelectTrigger className="bg-green-900/40">
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <AllDeviceTable
                mode={mode}
                data={filteredDevices} // Use filtered devices
                refreshAction={getData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
