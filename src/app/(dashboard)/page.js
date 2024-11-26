"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { InfoIcon, Wifi } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { API_URL, fetchDashboardInfo } from "@/lib/api"; // Import the fetch function
import Loader from "@/components/loader"; // Import your loader component or create a simple one
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowBigUpIcon } from "lucide-react";
import { ExternalLinkIcon } from "lucide-react";
import { Router } from "lucide-react";
import { WifiHigh } from "lucide-react";
import { WifiOff } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { Siren } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { MapPin } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // For Doughnut chart
);

export default function Home() {
  const [dashboardData, setDashboardData] = useState(null); // State to hold the dashboard data
  const [loading, setLoading] = useState(true); // State to handle loading
  const token = localStorage.getItem("bearerToken");

  const [recentData, setRecentData] = useState([]);

  const fetchRecentData = async () => {
    try {
      const res = await axios.get(`${API_URL}/devices/latest-device`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("res", res.data);
      setRecentData(res.data.devices);
    } catch (error) {
      console.log("Failed to fetch recent data:", error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const data = await fetchDashboardInfo("/info"); // Call the fetch function
        setDashboardData(data?.dashboardData);
      } catch (error) {
        console.log("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchRecentData();
    getData();
  }, []);

  // Data and configuration for User Activity (Line Chart)
  const userActivityData = {
    labels: ["2024-09-01", "2024-09-03", "2024-09-09", "2024-10-01"],
    datasets: [
      {
        label: "User Activity",
        data: [0.4, 0.6, 0.8, 1.0],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4, // smooth curves
      },
    ],
  };

  const userActivityOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Data and configuration for Device Statistics (Doughnut Chart)
  const deviceStatisticsData = {
    labels: ["Gateway", "AP"],
    datasets: [
      {
        label: "Device Statistics",
        data: [
          dashboardData?.deviceStatistics?.product?.GateWay ?? 0, // Use optional chaining and default to 0
          dashboardData?.deviceStatistics?.product?.Repeater ?? 0,
        ],
        backgroundColor: ["#4BC0C0", "#36A2EB"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="pb-12 ">
      <Navbar />

      {/* Loader Animation */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader /> {/* Use your Loader component here */}
        </div>
      ) : (
        <>
          {/* smruti  */}
          <div className="flex flex-col gap-6 px-10 md:px-12 mt-4">
            <h3 className="text-xl font-primary font-semibold">
              Resource Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {[
                {
                  label: "Total Device",
                  param: "all",
                  value: dashboardData?.deviceStatistics?.all ?? 0,
                  icon: (
                    <div className="size-[40px] grid place-content-center  bg-blue-500/10 text-blue-300 border border-blue-500 rounded-full">
                      <Router size={"20px"} />
                    </div>
                  ),
                },
                {
                  label: "Online Total",
                  param: "online",
                  value: dashboardData?.deviceStatistics?.online ?? 0,
                  icon: (
                    <div className="size-[40px] grid place-content-center bg-green-500/10 text-green-300 border border-green-500 rounded-full">
                      <WifiHigh size={"26px"} />
                    </div>
                  ),
                },
                {
                  label: "Offline Total",
                  param: "offline",
                  value: dashboardData?.deviceStatistics?.offline ?? 0,
                  icon: (
                    <div className="size-[40px] grid place-content-center bg-red-500/10 text-red-300 border border-red-500 rounded-full">
                      <WifiOff size={"20px"} />
                    </div>
                  ),
                },
                {
                  label: "Alarm Total",
                  param: "all",
                  value: dashboardData?.deviceStatistics?.alarm ?? 0,
                  icon: (
                    <div className="size-[40px] grid place-content-center bg-yellow-500/10 text-yellow-300 border border-yellow-500 rounded-full">
                      <Siren />
                    </div>
                  ),
                },

                {
                  label: "Inspection Report",
                  param: "all",
                  value: 6,
                  icon: (
                    <div className="size-[40px] grid place-content-center bg-orange-500/10 text-orange-300 border border-orange-500 rounded-full">
                      <TriangleAlert />
                    </div>
                  ),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col bg-white/5 p-4 rounded-lg border border-white/10 gap-2"
                >
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-base font-primary font-medium">
                      {item.label}
                    </span>

                    <Link href={"/all-devices?status="+item.param} className="font-primary opacity-60">
                      <ExternalLinkIcon className="size-[16px]" />
                    </Link>
                  </div>
                  <div className="flex flex-row gap-4 items-center w-full">
                    {item.icon}
                    <h4 className="text-4xl font-bold font-primary">
                      {item.value}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Statistics */}
          {/* <div className="px-10 md:px-12 mt-6 space-y-6 flex flex-col gap-2">
            <h1 className="text-2xl">Resource Statistics</h1>
            <div className="flex w-full  items-center flex-wrap px-0 md:px-6 gap-2 md:gap-4">
              {[
                {
                  label: "Total Device",
                  value: dashboardData?.deviceStatistics?.all ?? 0,
                },
                {
                  label: "Online Total",
                  value: dashboardData?.deviceStatistics?.online ?? 0,
                },
                {
                  label: "Alarm Total",
                  value: dashboardData?.deviceStatistics?.alarm ?? 0,
                },
                {
                  label: "Offline Total",
                  value: dashboardData?.deviceStatistics?.offline ?? 0,
                },
                { label: "Inspection Report", value: 6 }, // Hardcoded or from another source
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex-1 border flex items-center gap-4 md:gap-6"
                >
                  <div className="text-3xl md:text-5xl font-bold">
                    {item.value}
                  </div>
                  <div className="text-base md:text-lg font-medium leading-6">
                    {item.label.split(" ").map((word, i) => (
                      <span key={i}>
                        {word}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <Image
                src="/assets/wifi.png"
                alt="WiFi icon"
                width={100}
                height={100}
                className="w-20 relative right-10 md:right-0"
              />
            </div>
          </div> */}

          {/* Project and Pending Info Sections */}
          <div className="px-6 sm:px-12 mt-12 flex flex-col sm:flex-row gap-6">
            {/* Project Info Section */}
            <div className="space-y-6 flex-1 flex-col flex sm:flex-[1.5]">
              <h3 className="text-xl font-primary font-semibold">
                Project Info
              </h3>
              <div className="flex flex-1 gap-4">
                {/* My Project Card */}
                {dashboardData?.projectInfo?.length > 0 ? (
                  <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl border-white/10  transition">
                    <div className="flex gap-6 items-center justify-between border-b border-white/10 pb-4">
                      <div className="text-xl flex items-center gap-4">
                        <div className="bg-green-500/10 text-green-500 size-[40px] grid place-content-center rounded-full">
                          <Wifi size={20} />
                        </div>
                        <h1 className="text-base md:text-lg font-primary font-medium">
                          {dashboardData.projectInfo[0].name}
                        </h1>
                      </div>
                      {/* <p className="text-xs mt-2 text-muted-foreground">
                        Creation time: {dashboardData.projectInfo[0].created_at}
                      </p> */}
                      <div className="bg-blue-400/10 border border-blue-500/20 font-medium text-xs text-blue-300 px-4 py-2 rounded-full flex flex-row gap-1">
                        <span>
                          {/* todo : subproject length  */}
                          06
                        </span>
                        Sub Projects
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 items-center mt-4">
                      {dashboardData.projectInfo[0].dev_statistic.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="flex-1 flex flex-row items-center justify-between gap-2 bg-white/5 p-4 px-6 hover:bg-white/10 transition-all ease-in-out duration-200 rounded "
                          >
                            <div className="capitalize text-base font-medium font-primary">
                              {item.type}
                            </div>
                            <div className="text-3xl md:text-5xl font-semibold">
                              {item.devnums}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl flex justify-center items-center flex-col gap-2 hover:bg-white/10 transition">
                    <Wifi size={32} />
                    <p className="text-lg">No Project Info</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pending Info Section */}
            <div className="space-y-6 flex-1 sm:flex-[1]">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-primary font-semibold">
                  Recently Added
                </h3>
                <Link
                  href={"#"}
                  className="text-xs bg-primary/10 text-primary p-2 rounded-full  underline"
                >
                  <ExternalLinkIcon size={16} />
                </Link>
              </div>
              <div className="bg-white/5 flex flex-col overflow-y-auto gap-4 h-[300px] border border-white/10 p-4 rounded-xl">
                {recentData.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-center justify-between font-primary border-b border-white/10 pb-6 pt-2"
                  >
                    <div className="flex gap-4 items-center">
                      <div
                        className={`${
                          item.status === "1"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        } size-[40px] grid place-content-center rounded-full`}
                      >
                        {item.status === "1" ? (
                          <Wifi size={20} />
                        ) : (
                          <WifiOff size={20} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h1 className="text-base capitalize md:text-lg font-primary font-medium">
                          {item.deviceId && item.deviceId.length > 20
                            ? item.deviceId.slice(0, 20) + "..."
                            : item.deviceId}
                        </h1>
                        <p className="text-xs capitalize gap-1 flex flex-row items-center text-muted-foreground">
                          <MapPin size={16} /> {item.location} - {item.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.ipAddress}
                    </div>
                  </div>
                ))}
              </div>
              {/* <div className="grid grid-cols-1 gap-4">
                <div className="project-card flex-1 p-6 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition">
                  <div className="text-xl gap-4 flex items-center">
                    <span className="text-5xl font-semibold">02</span>
                    <h1>Pending Project</h1>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="w-full px-6 py-2 bg-primary/40 hover:bg-primary/60 transition border-2 border-primary rounded-full text-sm">
                      Dispose
                    </button>
                  </div>
                </div>

                <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                  <div className="text-xl gap-4 flex items-center">
                    <span className="text-5xl font-semibold">0</span>
                    <h1>Account Changes</h1>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 bg-primary/40 hover:bg-primary/60 transition border-2 w-full border-primary rounded-full text-sm">
                      Dispose
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Chart Sections */}
          <div className="px-6 sm:px-12 mt-10 lg:flex gap-6">
            {/* User Activity Section */}
            <div className="space-y-6 flex-1 flex flex-col lg:flex-[1.5]">
              <h1 className="text-2xl py-2">User Activity</h1>
              <div className="project-card flex justify-center items-center flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                <Line data={userActivityData} options={userActivityOptions} />
              </div>
            </div>

            {/* Device Statistics Section */}
            <div className="space-y-6 flex-1 sm:flex-[1]">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl py-2">Device Statistics</h1>
                <InfoIcon />
              </div>
              <div className="project-card flex justify-center items-center flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                <Doughnut data={deviceStatisticsData} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
