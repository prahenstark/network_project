"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import ToggleNav from "@/components/toggle-nav";
import AuthBasedForm from "@/components/app-auth/AuthBased";
import TokenBasedForm from "@/components/app-auth/tokenBased";
import SMSBasedForm from "@/components/app-auth/smsBased";
import AllUserDataTable from "@/components/app-auth/all-user-table";

export default function Auth() {
  const tabs = ["All Users", "Auth Based", "Token Based", "SMS Based"];
  const [activeTab, setActiveTab] = useState("All Users");

  const dummyData = {
    ret: 0,
    Count: 4,
    userobj_array: [
      {
        AuthType: 3,
        Name: "X12354",
        AuthInfo: "123456",
        Department: "default",
        PolicyLevel: "default",
        Mac: "00-00-00-00-00-00",
        DeviceIP: "0.0.0.0",
        CreateTime: 1731413798,
      },
      {
        AuthType: 3,
        Name: "X12354#1",
        AuthInfo: "123456",
        Department: "default",
        PolicyLevel: "default",
        Mac: "00-00-00-00-00-00",
        DeviceIP: "0.0.0.0",
        CreateTime: 1731413798,
      },
      // Add more rows as needed
    ],
  };

  const columns = [
    { header: "Name", accessorKey: "Name" },
    { header: "Auth Info", accessorKey: "AuthInfo" },
    { header: "Department", accessorKey: "Department" },
    { header: "Policy Level", accessorKey: "PolicyLevel" },
    { header: "MAC Address", accessorKey: "Mac" },
    { header: "Device IP", accessorKey: "DeviceIP" },
    {
      header: "Create Time",
      accessorKey: "CreateTime",
      cell: (info) => new Date(info.getValue() * 1000).toLocaleString(),
    },
  ];

  const tabsContent = {
    "All Users": (
      <AllUserDataTable
        columns={columns}
        rawData={dummyData}
        loading={false}
        rowClassName={(index) => (index % 2 === 0 ? "bg-green-100/5" : "")}
      />
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
