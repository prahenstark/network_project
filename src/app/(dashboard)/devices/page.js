"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ProjectList from "@/components/projects-list";
import ToggleHeader from "@/components/toggle-header";
import SelectDropdown from "@/components/select-dropdown";
import Searchbar from "@/components/searchbar";
import { FileInput } from "lucide-react";
import IconDropdown from "@/components/icon-dropdown";
import { ChevronDown } from "lucide-react";
import DeviceTable from "@/components/devices/device-table";
import Loader from "@/components/loader"; // Assuming you have a Loader component
import { fetchDashboardInfo } from "@/lib/api"; // Adjust import as necessary
import { GitFork } from "lucide-react";
import { Filter } from "lucide-react";
import { useDevice } from "@/context/device-context";

export default function Devices() {
  const [loading, setLoading] = useState(true);
  const [devicesData, setDevicesData] = useState(null); // State to hold device data
  const { selectedDeviceProject } = useDevice();

  // Flatten the project list to get all projects regardless of hierarchy
  const flattenDeviceProjects = (data) => {
    let projects = data?.projectList ?? [];
    let flatList = [];

    const recurse = (project) => {
      if (!project || typeof project !== "object") {
        console.warn("Invalid project structure:", project);
        return;
      }

      flatList.push(project);

      // Ensure child is an array before iterating
      if (Array.isArray(project.child)) {
        project.child.forEach(recurse);
      } else {
        console.warn("Expected child to be an array, got:", project.child);
      }
    };

    // Check if projects is an array
    if (Array.isArray(projects)) {
      projects.forEach(recurse);
    } else {
      console.warn("Expected projects to be an array, got:", projects);
    }

    return flatList;
  };

  const allProjects = flattenDeviceProjects(devicesData);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const data = await fetchDashboardInfo("/device"); // Adjust the API path as necessary
        setDevicesData(data?.DevicePageData || []); // Use optional chaining and default to an empty array
        // console.log(data);
      } catch (error) {
        console.log("Failed to fetch devices data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getData();
  }, []);

  // Function to find the device corresponding to the selected project
  const getDeviceForSelectedProject = () => {
    if (!selectedDeviceProject || !devicesData) return null;

    return devicesData?.devices.find(
      (device) => device.gid === selectedDeviceProject.gid
    );
  };

  const selectedDevice = getDeviceForSelectedProject();
  // console.log("Selected Device:", selectedDevice);

  const dropdownOptions = [
    { label: "All", value: "all" },
    { label: "Test 1", value: "test1" },
    { label: "Test 2", value: "test2" },
    { label: "Test 3", value: "test3" },
  ];

  const dropdownOptions2 = [
    { label: "All Models", value: "all" },
    { label: "Test 1", value: "test1" },
    { label: "Test 2", value: "test2" },
    { label: "Test 3", value: "test3" },
  ];

  const iconDropdownOptions = [
    "Create Account",
    "Reset Account",
    "Delete Account",
  ];

  return (
    <div>
      <Navbar title="Devices" />
      <div className="flex flex-1 overflow-y-clip">
        <ProjectList projects={allProjects} />

        <div className="flex flex-col w-full">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader /> {/* Display your Loader component here */}
            </div>
          ) : (
            <>
              <div className="flex items-center p-6">
                <div className="flex-1 flex items-center gap-2 text-primary">
                  <div className="text-5xl font-bold">
                    {selectedDevice?.deviceStatistics?.all ?? 0}
                  </div>
                  <div className="text-lg font-medium">All</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">N/A</div>
                  <div className="text-lg font-medium">AP</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">N/A</div>
                  <div className="text-lg font-medium">CPE</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">N/A</div>
                  <div className="text-lg font-medium">4G</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">N/A</div>
                  <div className="text-lg font-medium">5G</div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex gap-4">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-blue-600" />
                      <span className="text-xs">
                        Devices: {selectedDevice?.deviceStatistics?.all ?? 0}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-green-500" />
                      <span className="text-xs">
                        Offline:{" "}
                        {selectedDevice?.deviceStatistics?.offline ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-orange-600" />
                      <span className="text-xs">
                        Alarm: {selectedDevice?.deviceStatistics?.alarm ?? 0}
                      </span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-white" />
                      <span className="text-xs">
                        Online: {selectedDevice?.deviceStatistics?.online ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <ToggleHeader pageName="Device List" className="px-6">
                <IconDropdown
                  className="border-green-500 min-w-20"
                  options={iconDropdownOptions}
                >
                  <GitFork size={18} />
                  <ChevronDown size={18} />
                </IconDropdown>
                <SelectDropdown
                  className="min-w-28"
                  options={dropdownOptions}
                />
                <SelectDropdown
                  className="min-w-28"
                  options={dropdownOptions2}
                />
                <Searchbar displayText="🔍 Search" />
                <IconDropdown
                  className="border-green-500 min-w-20"
                  options={iconDropdownOptions}
                >
                  <FileInput size={18} />
                  <ChevronDown size={18} />
                </IconDropdown>
                <IconDropdown
                  className="border-green-500 min-w-20 "
                  options={iconDropdownOptions}
                >
                  <Filter size={18} />
                  <ChevronDown size={18} />
                </IconDropdown>
              </ToggleHeader>
              <DeviceTable data={selectedDevice} />
              {/* Pass devicesData to DeviceTable */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
