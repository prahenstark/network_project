"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ToggleHeader from "@/components/toggle-header";
import SelectDropdown from "@/components/select-dropdown";
import DeviceTable from "@/components/devices/device-table";
import Loader from "@/components/loader";
import { fetchDashboardInfo } from "@/lib/api";
import { useDevice } from "@/context/device-context";
import AllDeviceTable from "@/components/all-devices/all-device-table";

export default function AllDevices() {
  const [loading, setLoading] = useState(true);
  const [allDevicesData, setAllDevicesData] = useState([]);
  const { selectedDeviceProject } = useDevice();

  const getData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardInfo("/device");
      const devices = data?.DevicePageData?.devices || [];
      const flattenedDevices = flattenDevices(devices);
      console.log("Devices ", flattenedDevices);
      setAllDevicesData(flattenedDevices);
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

  const dropdownOptions = [
    { label: "All", value: "all" },
    { label: "Online", value: "online" },
    { label: "Offline", value: "offline" },
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
              <ToggleHeader pageName="All Device List" className="px-6 pt-8 ">
                <SelectDropdown
                  className="min-w-20 md:min-w-28"
                  options={dropdownOptions}
                  
                />
              </ToggleHeader>
              <div className="md:hidden h-32"></div>
              <AllDeviceTable data={allDevicesData} refreshAction={getData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
