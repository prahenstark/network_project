"use client"

import Navbar from "@/components/navbar";
import { InfoIcon, Wifi } from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";


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
        data: [1, 1],
        backgroundColor: ["#4BC0C0", "#36A2EB"],
        hoverOffset: 4,
      },
    ],
  };


  return (
    <div className="pb-12">
      <Navbar />

      {/* Resource Statistics */}
      <div className="px-12 mt-6 space-y-2">
        <h1 className="text-2xl">Resource Statistics</h1>
        <div className="flex items-center pX-6 gap-4">
          {[
            { label: "Total Device", value: 12 },
            { label: "Online Total", value: 6 },
            { label: "Alarm Total", value: 4 },
            { label: "Offline Total", value: 6 },
            { label: "Inspection Report", value: 6 },
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
            <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl hover:bg-white/10 transition">
              <div className="text-xl flex items-center">
                <Wifi className="mr-4" /> 
                <h1>My Project</h1>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">
                Creation time: {`11-3-2024 19:30:56`}
              </p>
              <div className="flex items-center mt-6">
                {[
                  { label: "AP", value: 12 },
                  { label: "Gateway", value: 1 },
                ].map((item, index) => (
                  <div key={index} className="flex-1 flex items-center gap-2">
                    <div className="text-4xl font-semibold">{item.value}</div>
                    <div className="text-lg font-medium leading-6">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* No Project Info Card */}
            <div className="project-card flex-1 p-6 bg-white/5 border rounded-xl flex justify-center items-center flex-col gap-2 hover:bg-white/10 transition">
              <Wifi size={32} />
              <p className="text-lg">No Project Info</p>
            </div>
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






    </div>
  );
}
