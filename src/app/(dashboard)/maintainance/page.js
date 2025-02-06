"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import ProjectList from "@/components/projects-list";
import ToggleNav from "@/components/toggle-nav";
import ToggleDisplay from "@/components/toggle-display";
import ToggleHeader from "@/components/toggle-header";
import Upgrade from "@/components/maintainace-page/upgrade";
import ConfigurationLog from "@/components/maintainace-page/configuration-log";
import UpgradeLog from "@/components/maintainace-page/upgrade-log";
import Template from "@/components/maintainace-page/template";

export default function Maintainance({}) {
  const tabs = ["Upgrade", "Configuration Log", "Upgrade Log", "Template"];

  const [activeTab, setActiveTab] = useState("Upgrade");

  const tabsContent = {
    Upgrade: <Upgrade />,
    "Configuration Log": <ConfigurationLog/>,
    "Upgrade Log": <UpgradeLog/>,
    Template: <Template/>,
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
            className="p-6 bg-white bg-opacity-5 rounded-md"
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          {tabsContent[activeTab]}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
