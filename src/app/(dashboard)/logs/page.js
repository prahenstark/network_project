"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import ToggleNav from "@/components/toggle-nav";
import AuthBasedForm from "@/components/app-auth/AuthBased";
import ApLogs from "@/components/logs/ap-logs";
import AcLogs from "@/components/logs/ac-logs";

export default function Logs() {
  const tabs = ["AP Logs", "AC Logs"];
  const [activeTab, setActiveTab] = useState("AP Logs");

  const tabsContent = {
    "AP Logs": <ApLogs />,
    "AC Logs": <AcLogs />,
  };

  return (
    <div>
      <Navbar title="Logs" />

      <div className="min-h-screen flex flex-col p-6">
        {/* Navbar for Tab Controls */}
        <ToggleNav
          className="pb-6"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {tabsContent[activeTab]}
      </div>
    </div>
  );
}
