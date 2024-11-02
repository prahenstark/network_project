"use client"
import { useState } from "react";
import Navbar from "@/components/navbar";
import ToggleNav from "@/components/toggle-nav";



export default function Auth({ }) {
  const tabs = ["Auth", "Strategy", "Auth Methods", "Auth Details"];

  const [activeTab, setActiveTab] = useState("Auth");

  return (
    <div>
      <Navbar title="Authentication" />
      <div>
        <ToggleNav
          className="p-6"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
} 