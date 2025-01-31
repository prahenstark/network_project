"use client";
import Navbar from "@/components/navbar";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AccountsLayout({ children }) {
  const tabs = [
    { key: "account", label: "Account", link: "/accounts" },
    { key: "approve", label: "Approve Users", link: "/accounts/approve-users" },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.link === pathname);
    if (currentTab) {
      setActiveTab(currentTab.key);
    } else {
      setActiveTab(tabs[0].key);
    }
  }, [pathname]);

  return (
    <div>
      <Navbar title="Accounts" />
      <div className="flex flex-col m-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 overflow-x-scroll pb-4 border-b border-gray-700 hide-scrbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => router.push(tab.link)}
              className={`py-2 px-4 rounded-md whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-green-600/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {/* Page Content */}
      {children}
    </div>
  );
}
