"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import ProjectList from "@/components/projects-list";
import ToggleNav from "@/components/toggle-nav";
import ToggleDisplay from "@/components/toggle-display";
import ToggleHeader from "@/components/toggle-header";
import Upgrade from "@/components/maintainace-page/upgrade";

export default function Maintainance({}) {
  const tabs = ["Upgrade", "Configuration Log", "Upgrade Log", "Template"];

  const [activeTab, setActiveTab] = useState("Upgrade");

  const tabsContent = {
    Upgrade: <Upgrade/>,
    "Configuration Log": "Learn more About us in this section.",
    "Upgrade Log": "Discover our Services here.",
    Template: "Get in touch with us through the Contact section.",
  };

  return (
    <div>
      <Navbar title="Maintainance" />
      {/* <div className="flex h-full flex-1"> */}
        {/* <ProjectList /> */}
        <div className="flex-1 min-h-svh">
          <div className="min-h-screen flex flex-col items-center ">
            {/* Navbar for Tab Controls */}
          <ToggleNav
            className="p-6"
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {tabsContent[activeTab]}
            {/* Display Section */}
            {/* <ToggleDisplay activeTab={activeTab} content={tabsContent} /> */}
          </div>
        </div>
      {/* </div> */}
    </div>
  );
}
