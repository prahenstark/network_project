"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import ToggleNav from "@/components/toggle-nav";
import AuthBasedForm from "@/components/app-auth/AuthBased";
import CouponBasedForm from "@/components/app-auth/couponBased";
import SMSBasedForm from "@/components/app-auth/smsBased";
import AllUserDataTable from "@/components/app-auth/all-user-table";
import AllUsers from "@/components/app-auth/all-user";
import ApproveUser from "@/components/app-auth/approve-user";

export default function Auth() {
  const tabs = [
    "Guest Users",
    "Auth Based",
    "Coupon Based",
    "SMS Based",
    "Approve User",
  ];
  const [activeTab, setActiveTab] = useState("Guest Users");

  const tabsContent = {
    "Guest Users": <AllUsers />,
    "Auth Based": <AuthBasedForm />,
    "Coupon Based": <CouponBasedForm />,
    "SMS Based": <SMSBasedForm />,
    "Approve User": <ApproveUser />,
  };

  return (
    <div>
      <Navbar title="Authentication" />

      <div className="min-h-screen flex flex-col p-6">
        {/* Navbar for Tab Controls */}
        <ToggleNav
          className="mb-6 bg-white bg-opacity-5 rounded-md"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {tabsContent[activeTab]}
      </div>
    </div>
  );
}
