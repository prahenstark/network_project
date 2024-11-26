"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import ToggleNav from "@/components/toggle-nav";
import AuthBasedForm from "@/components/app-auth/AuthBased";
import TokenBasedForm from "@/components/app-auth/tokenBased";
import SMSBasedForm from "@/components/app-auth/smsBased";
import AllUserDataTable from "@/components/app-auth/all-user-table";
import AllUsers from "@/components/app-auth/all-user";

export default function Auth() {
  const tabs = ["Guest Users", "Auth Based", "Token Based", "SMS Based"];
  const [activeTab, setActiveTab] = useState("Guest Users");



  const tabsContent = {
    "Guest Users": (
      <AllUsers />
    ),
    "Auth Based": <AuthBasedForm />,
    "Token Based": <TokenBasedForm />,
    "SMS Based": <SMSBasedForm />,
  };

  return (
    <div>
      <Navbar title="Authentication" />

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
