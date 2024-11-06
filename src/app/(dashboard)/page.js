"use client";

import { useEffect, useState } from 'react';
import Navbar from "@/components/navbar";
import { InfoIcon, Wifi } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { fetchDashboardInfo } from '@/lib/api';  // Import the fetch function
import Loader from "@/components/loader";  // Import your loader component or create a simple one

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

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const data = await fetchDashboardInfo("/info"); // Call the fetch function
        setDashboardData(data?.dashboardData); // Use optional chaining when setting the state
        console.log(dashboardData)
      } catch (error) {
        console.log('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

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
    <div className="pb-12">
      <Navbar />

      {/* Loader Animation */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader /> {/* Use your Loader component here */}
        </div>
      ) : (
        <>
          {/* Resource Statistics */}
          <div className="px-12 mt-6 space-y-2">
            <h1 className="text-2xl">Resource Statistics</h1>
            <div className="flex items-center px-6 gap-4">
              {[ 
                { label: "Total Device", value: dashboardData?.deviceStatistics?.all ?? 0 },
                { label: "Online Total", value: dashboardData?.deviceStatistics?.online ?? 0 },
                { label: "Alarm Total", value: dashboardData?.deviceStatistics?.alarm ?? 0 },
                { label: "Offline Total", value: dashboardData?.deviceStatistics?.offline ?? 0 },
                { label: "Inspection Report", value: 6 }, // Hardcoded or from another source
              ].map((item, index) => (
                <div key={index} className="flex-1 flex items-center gap-6">
                  <div className="text-5xl font-bold">{item.value}</div>
                  <div className="text-lg font-medium leading-6">
                    {item.label.split(" ").map((word, i) => (
                      <span key={i}>
                        {word}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <img src="assets/wifi.png" alt="WiFi icon" />
            </div>
          </div>

          {/* Project and Pending Info Sections */}
          <div className="px-12 flex gap-6">
            {/* Project Info Section */}
            <div className="space-y-6 flex flex-col flex-[1.5]">
              <h1 className="text-2xl py-6">Project Info</h1>
              <div className="flex gap-4">
                {/* My Project Card */}
                {dashboardData?.projectInfo?.length > 0 ? (
                  <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                    <div className="text-xl flex items-center">
                      <Wifi className="mr-4" /> 
                      <h1>{dashboardData.projectInfo[0].name}</h1>
                    </div>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Creation time: {dashboardData.projectInfo[0].created_at}
                    </p>
                    <div className="flex items-center mt-6">
                      {dashboardData.projectInfo[0].dev_statistic.map((item, index) => (
                        <div key={index} className="flex-1 flex items-center gap-2">
                          <div className="text-4xl font-semibold">{item.devnums}</div>
                          <div className="text-lg font-medium leading-6">{item.type}</div>
                        </div>
                      ))}
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
            <div className="space-y-6 flex flex-col flex-1">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl py-6">Pending Info</h1>
                <InfoIcon />
              </div>
              <div className="flex gap-4">
                {/* Pending Project Card */}
                <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                  <div className="text-xl gap-4 flex items-center">
                    <span className="text-5xl font-semibold">02</span> 
                    <h1>Pending Project</h1>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 bg-primary/40 hover:bg-primary/60 transition border-2 border-primary rounded-full text-sm">
                      Dispose
                    </button>
                  </div>
                </div>

                {/* Account Changes Card */}
                <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                  <div className="text-xl gap-4 flex items-center">
                    <span className="text-5xl font-semibold">0</span> 
                    <h1>Account Changes</h1>
                  </div>
                  <div className="flex justify-end mt-6">
                    <button className="px-6 py-2 bg-primary/40 hover:bg-primary/60 transition border-2 border-primary rounded-full text-sm">
                      Dispose
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Sections */}
          <div className="px-12 mt-12 flex gap-6">
            {/* User Activity Section */}
            <div className="space-y-6 flex flex-col flex-[1.5]">
              <h1 className="text-2xl py-6">User Activity</h1>
              <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                <Line data={userActivityData} options={userActivityOptions} />
              </div>
            </div>

            {/* Device Statistics Section */}
            <div className="space-y-6 flex flex-col flex-1">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl py-6">Device Statistics</h1>
                <InfoIcon />
              </div>
              <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
                <div className="w-10/12 m-auto">
                  <Doughnut data={deviceStatisticsData} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
