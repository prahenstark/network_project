"use client";

import Navbar from "@/components/navbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogsList({ children }) {
  const tabs = [
    { key: "system_logs", label: "System Logs", link: "/logs" },
    { key: "ap_logs", label: "AP Logs", link: "/logs/ap-logs" },
    { key: "ac_logs", label: "AC Logs", link: "/logs/ac-logs" },
    {
      key: "connected_list",
      label: "Connected List",
      link: "/logs/connected-list",
    },
    {
      key: "connection_summary",
      label: "Connection Summary",
      link: "/logs/connection-summary",
    },
    {
      key: "ip_real_time",
      label: "IP Real-Time Stream",
      link: "/logs/ip-real-time",
    },
    {
      key: "app_flow",
      label: "App Flow",
      link: "/logs/app-flow",
    },
    {
      key: "auth_whitelist",
      label: "Auth Whitelist",
      link: "/logs/auth-whitelist",
    },
    {
      key: "radio-info",
      label: "Radio Info",
      link: "/logs/radio-info",
    },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");

  // Determine the active tab based on the current route
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.link === pathname);
    if (currentTab) {
      setActiveTab(currentTab.key);
    } else {
      setActiveTab(tabs[0].key)
    }
  }, [pathname]);

  return (
    <div>
      <Navbar title="Logs" />
      <div className="flex flex-col m-6">
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
