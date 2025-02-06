"use client";

import { useState } from "react";
import ToggleNav from "../toggle-nav";

export default function BeforeAuthComponent({}) {
  const devices = ["Mobile", "Desktop"];
  const modes = ["Before Auth", "Process Auth", "After Auth"]; // Auth procedures
  const [activeDevice, setActiveDevice] = useState("Mobile");
  const [activeMode, setActiveMode] = useState("Before Auth");

  // State for Before Auth fields
  const [titleName, setTitleName] = useState("sms");
  const [guideAddress, setGuideAddress] = useState("sms");
  const [color, setColor] = useState("#00ff00");

  // State for Process Auth fields
  const [tipsPicture, setTipsPicture] = useState(null);

  // State for After Auth fields
  const [tips, setTips] = useState("sms");
  const [afterAuthTipsPicture, setAfterAuthTipsPicture] = useState(null);

  const renderContent = () => {
    switch (activeMode) {
      case "Before Auth":
        return (
          <div>
            <div className="flex mt-4 items-center">
              <label className="min-w-40 text-xl">Title Name</label>
              <input
                type="text"
                value={titleName}
                onChange={(e) => setTitleName(e.target.value)}
                className="flex-1 p-2 rounded-md bg-gray-100/5"
              />
            </div>
            <div className="flex mt-4 items-center">
              <label className="min-w-40 text-xl">Banner</label>
              <div className="flex flex-1 gap-4">
                {Array(3)
                  .fill("")
                  .map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-300/5 flex items-center justify-center rounded-md">
                        Add +
                      </div>
                      <button className="mt-2 border-primary border-2 text-white font-medium text-sm px-4 py-1 rounded-md">
                        Upload
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            <p className="text-xs text-right text-red-500 mt-2">
              Suggested picture size (1170px*1020px.jpg/png) not greater than
              200K
            </p>
            <div className="flex mt-4 items-center">
              <label className="min-w-40 text-xl">Guide Address</label>
              <input
                type="text"
                value={guideAddress}
                onChange={(e) => setGuideAddress(e.target.value)}
                className="flex-1 p-2 rounded-md bg-gray-100/5"
              />
            </div>
            <div className="flex mt-4 items-center">
              <label className="min-w-40 text-xl">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 border border-gray-300/5 rounded-md"
              />
            </div>
            <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md">
              Apply
            </button>
          </div>
        );
      case "Process Auth":
        return (
          <div>
            <div className="flex mt-4 items-center">
              <label className="min-w-40 text-xl">Tips Picture</label>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-300/5 flex items-center justify-center rounded-md">
                  Add +
                </div>
                <button className="mt-2 border-primary border-2 text-white text-sm font-medium px-4 py-1 rounded-md">
                  Upload
                </button>
              </div>
            </div>
            <p className="text-sm text-red-500 mt-2">
              Suggested picture size (1170px*1020px.jpg/png) not greater than
              500K
            </p>
            <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md">
              Apply
            </button>
          </div>
        );
      case "After Auth":
        return (
          <div>
            <div className="flex mt-4 items-center">
              <label className="min-w-40 text-xl">Tips</label>
              <input
                type="text"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                className="flex-1 p-2 rounded-md bg-gray-100/5"
              />
            </div>
            <div className="flex mt-4 items-center">
              <label className="min-w-40 text-xl">Tips Picture</label>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-300/5 flex items-center justify-center rounded-md">
                  Add +
                </div>
                <button className="mt-2 border-primary border-2 text-white text-sm font-medium px-4 py-1 rounded-md">
                  Upload
                </button>
              </div>
            </div>
            <p className="text-sm text-red-500 mt-2">
              Suggested picture size (1170px*1020px.jpg/png) not greater than
              500K
            </p>
            <button className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md">
              Apply
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <h1 className="text-2xl font-bold">Auth Page Set</h1>
        <div className="justify-center flex items-center">
          <img
            src={
              activeDevice === "Mobile"
                ? "/assets/MobileImage.svg"
                : "/assets/laptop_realistic.svg"
            }
            alt=""
          />
        </div>
      </div>
      <div className="flex-1 p-6">
        {/* Device ToggleNav */}
        <ToggleNav
          className="p-6 bg-white bg-opacity-5 rounded-md"
          tabs={devices}
          activeTab={activeDevice}
          setActiveTab={setActiveDevice}
        />

        {/* Mode ToggleNav for Auth Procedures */}
        <div className="flex mt-4 items-center">
          <label className="min-w-40 text-xl">Auth Procedure</label>
          <ToggleNav
            className="flex-1 px-6 bg-white bg-opacity-5 rounded-md"
            tabs={modes}
            activeTab={activeMode}
            setActiveTab={setActiveMode}
          />
        </div>

        {/* Render Content based on activeMode */}
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
}
