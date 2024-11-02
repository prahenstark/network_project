"use client"

import { useState } from "react";
import ToggleNav from "../toggle-nav";

export default function BeforeAuthComponent({}) {
  const devices = ["Mobile", "Desktop"];
  const modes = ["Before Auth", "Process Auth", "After Auth"]; // Auth procedures
  const [activeDevice, setActiveDevice] = useState("Mobile");
  const [activeMode, setActiveMode] = useState("Before Auth");

  return (
    <div className="flex">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Auth Page Set</h1>
        <div className="justify-center flex items-center">
          <img
            src={activeDevice === "Mobile" ? "/assets/MobileImage.svg" : "/assets/laptop_realistic.svg"}
            alt=""
          />
        </div>
      </div>
      <div className="flex-1">
        {/* Device ToggleNav */}
        <ToggleNav
          className="p-6"
          tabs={devices}
          activeTab={activeDevice}
          setActiveTab={setActiveDevice}
        />

        {/* Mode ToggleNav for Auth Procedures */}
        <div className="flex mt-4">
          <div className="min-w-40 flex items-center">
            <h3 className="text-xl">Auth Procedure</h3>
          </div>
          <div className="flex-1">
            <ToggleNav
              className="px-6"
              tabs={modes}
              activeTab={activeMode}
              setActiveTab={setActiveMode}
            />
          </div>
        </div>

        {/* Additional fields */}
        <div className="flex mt-4">
          <div className="min-w-40">
            <h3 className="text-xl">Auth</h3>
          </div>
          <div className="flex-1">
            {/* Placeholder for any additional content related to Auth */}
          </div>
        </div>
      </div>
    </div>
  );
}
