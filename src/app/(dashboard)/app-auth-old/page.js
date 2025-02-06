"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import ToggleNav from "@/components/toggle-nav";
import BeforeAuthComponent from "@/components/auth-page-old/beforeAuth";
import Strategy from "@/components/auth-page-old/strategy";
import AuthMethods from "@/components/auth-page-old/auth-methods";
import AuthDetails from "@/components/auth-page-old/auth-details";

export default function Auth() {
  const tabs = ["Auth", "Strategy", "Auth Methods", "Auth Details"];
  const [activeTab, setActiveTab] = useState("Auth");

  const tabsContent = {
    Auth: <BeforeAuthComponent />,
    Strategy: <Strategy />,
    "Auth Methods": <AuthMethods/>,
    "Auth Details": <AuthDetails/>,
  };

  return (
    <div>
      <Navbar title="Authentication" />

      <div className="min-h-screen flex flex-col p-6">
        {/* Navbar for Tab Controls */}
        <ToggleNav
          className="pb-6 bg-white bg-opacity-5 rounded-md"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {tabsContent[activeTab]}
      </div>
    </div>
  );
}
