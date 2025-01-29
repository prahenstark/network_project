"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ProjectList from "@/components/projects-list";
import ToggleHeader from "@/components/toggle-header";
import SelectDropdown from "@/components/select-dropdown";
import Searchbar from "@/components/searchbar";
import { FileInput, GitFork, Filter, ChevronDown, Menu } from "lucide-react";
import IconDropdown from "@/components/icon-dropdown";
import DeviceTable from "@/components/devices/device-table";
import Loader from "@/components/loader";
import { fetchDashboardInfo } from "@/lib/api";
import { useDevice } from "@/context/device-context";
import AddDeviceModal from "@/components/devices/add-device-modal";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function Devices() {
  const [loading, setLoading] = useState(true);
  const [devicesData, setDevicesData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useSearchParams();
  const status = params.get("status");
  const [searchQuery, setSearchQuery] = useState("");

  const { selectedDeviceProject } = useDevice();

  const getData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardInfo("/device");
      setDevicesData(data?.DevicePageData || []);
      setProjectData(data?.DevicePageData?.projectList || []);
    } catch (error) {
      console.log("Failed to fetch devices data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getDeviceForSelectedProject = () => {
    if (!selectedDeviceProject || !devicesData) return null;

    return devicesData?.devices.find(
      (device) => device.gid === selectedDeviceProject.gid
    );
  };

  const selectedDevice = getDeviceForSelectedProject();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const [toggleProjectList, setToggleProjectList] = useState(false);

  const toggleProjectListFunction = () => {
    setToggleProjectList(!toggleProjectList);
  };

  const handleAddDeviceClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <Navbar title="Devices" />

      <div className="md:flex flex-1">
        <div className={toggleProjectList ? "hidden" : ""}>
          <ProjectList projects={devicesData?.projectList} />
        </div>

        <div className="flex flex-col max-w-full overflow-x-auto max-md:mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          ) : (
            <>
              <div className="flex items-center p-6 flex-wrap gap-4">
                <div className="flex-1 flex items-center gap-2 text-primary justify-center md:justify-start">
                  <div className="text-4xl font-bold">
                    {selectedDevice?.deviceStatistics?.all ?? 0}
                  </div>
                  <div className="text-lg font-medium">All</div>
                </div>

                <div className="flex-1 flex items-center gap-2 justify-center md:justify-start">
                  <div className="text-3xl font-bold">N/A</div>
                  <div className="text-lg font-medium">AP</div>
                </div>

                <div className="flex-1 flex items-center gap-2  justify-center md:justify-start">
                  <div className="text-3xl font-bold">N/A</div>
                  <div className="text-lg font-medium">CPE</div>
                </div>

                <div className="flex-1 flex items-center gap-2  justify-center md:justify-start">
                  <div className="text-3xl font-bold">N/A</div>
                  <div className="text-lg font-medium">4G</div>
                </div>

                <div className="flex-1 flex items-center gap-2  justify-center md:justify-start">
                  <div className="text-3xl font-bold">N/A</div>
                  <div className="text-lg font-medium">5G</div>
                </div>
              </div>
              <ToggleHeader
                pageName="Device List"
                className="px-6 max-md:mb-32"
              >
                <div className="flex items-center justify-between gap-4 max-w-full">
                  {/* <button onClick={toggleProjectListFunction}>
                    <Menu />
                  </button> */}
                  <IconDropdown
                    className="border-green-500 min-w-16 md:min-w-20"
                    options={iconDropdownOptions}
                    disabled={true}
                  >
                    <GitFork size={18} />
                    <ChevronDown size={18} />
                  </IconDropdown>
                  <SelectDropdown
                    className="min-w-20 md:min-w-28"
                    options={dropdownOptions}
                    disabled={true}
                  />
                  <SelectDropdown
                    className="min-w-28"
                    options={dropdownOptions2}
                    disabled={true}
                  />
                </div>
                <div>
                  {/* Search by IP Address */}
                  <Input
                    type="text"
                    placeholder="Search by IP Address"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-white bg-opacity-5"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <IconDropdown
                    className="border-green-500 min-w-20"
                    options={iconDropdownOptions}
                    disabled={true}
                  >
                    <FileInput size={18} />
                    <ChevronDown size={18} />
                  </IconDropdown>
                  <IconDropdown
                    className="border-green-500 min-w-20"
                    options={iconDropdownOptions}
                    disabled={true}
                  >
                    <Filter size={18} />
                    <ChevronDown size={18} />
                  </IconDropdown>
                  <button
                    type="button"
                    onClick={handleAddDeviceClick}
                    className="min-w-20 max-h-9 px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-300 text-xs md:text-base"
                  >
                    Add Device
                  </button>
                </div>
              </ToggleHeader>

              <DeviceTable
                searchQuery={searchQuery}
                statusFilter={status}
                data={selectedDevice}
                refreshAction={getData}
              />
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddDeviceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          projectData={projectData}
          refreshAction={getData}
        />
      )}
    </div>
  );
}
