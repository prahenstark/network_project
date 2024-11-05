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

export default function Devices() {
  const [loading, setLoading] = useState(true);
  const [devicesData, setDevicesData] = useState(null); // State to hold device data

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const data = await fetchDashboardInfo("/device"); // Adjust the API path as necessary
        setDevicesData(data?.workgroupInfo || []); // Use optional chaining and default to an empty array
      } catch (error) {
<<<<<<< HEAD
        console.error("Failed to fetch devices data:", error);
=======
        console.log('Failed to fetch devices data:', error);
>>>>>>> 18d8cea460244fe83d323f7afb240bbb262944b6
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getData();
  }, []);

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
      <div className="flex h-full flex-1">
        <ProjectList />

        <div className="flex flex-col w-full">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader /> {/* Display your Loader component here */}
            </div>
          ) : (
            <>
              <div className="flex items-center p-6">
                <div className="flex-1 flex items-center gap-2 text-primary">
<<<<<<< HEAD
                  <div className="text-5xl font-bold">
                    {devicesData.length || 0}   
                  </div>
=======
                  <div className="text-5xl font-bold">{devicesData?.length ?? 0}</div>
>>>>>>> 18d8cea460244fe83d323f7afb240bbb262944b6
                  <div className="text-lg font-medium">All</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">01</div>
                  <div className="text-lg font-medium">AP</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">01</div>
                  <div className="text-lg font-medium">CPE</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">01</div>
                  <div className="text-lg font-medium">4G</div>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <div className="text-5xl font-bold">01</div>
                  <div className="text-lg font-medium">5G</div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex gap-4">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-blue-600" />
<<<<<<< HEAD
                      <span className="text-xs">
                        Devices: {devicesData.length || 0}
                      </span>
=======
                      <span className="text-xs">Devices: {devicesData?.length ?? 0}</span>
>>>>>>> 18d8cea460244fe83d323f7afb240bbb262944b6
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-green-600" />
                      <span className="text-xs">Offline: 0</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-orange-600" />
                      <span className="text-xs">Alarm: 2</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="size-4 rounded-md bg-white" />
<<<<<<< HEAD
                      <span className="text-xs">
                        Online: {devicesData.length || 0}
                      </span>
=======
                      <span className="text-xs">Online: {devicesData?.length ?? 0}</span>
>>>>>>> 18d8cea460244fe83d323f7afb240bbb262944b6
                    </div>
                  </div>
                </div>
              </div>
              <ToggleHeader pageName="Upgrade" className="px-6">
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
              </ToggleHeader>
              <DeviceTable data={devicesData} />{" "}
              {/* Pass devicesData to DeviceTable */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
