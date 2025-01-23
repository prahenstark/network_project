"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  FolderIcon,
  UsersIcon,
  LockIcon,
  ShieldAlertIcon,
  WifiIcon,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-provider";
import { LogOut } from "lucide-react";
import LogoutModal from "./logout-modal";
import { useState } from "react";
import Image from "next/image";
import { useUIState } from "@/hooks/use-uiState";
import { RouterIcon } from "lucide-react";
import { NetworkIcon } from "lucide-react";
import { MonitorSmartphoneIcon } from "lucide-react";
import { LogsIcon } from "lucide-react";
import { Cast } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getMenuItems = (user) => {
    const items = [
      { href: "/", icon: LayoutDashboardIcon, name: "Dashboard" },
      { href: "/devices", icon: RouterIcon, name: "Devices" },
      { href: "/tree", icon: NetworkIcon, name: "Network Tree" },
      {
        href: "/all-devices",
        icon: MonitorSmartphoneIcon,
        name: "All Devices",
      },
      { href: "/projects", icon: FolderIcon, name: "Projects" },
      { href: "/app-auth", icon: LockIcon, name: "App Auth" },
      { href: "/logs", icon: LogsIcon, name: "Logs" },
      {
        href: "/bandwidth-management",
        icon: Cast,
        name: "Bandwidth Management",
      },
    ];
    if (user && user.role === "vendor") {
      items.push({ href: "/accounts", icon: UsersIcon, name: "Accounts" });
    }
    return items;
  };

  const menuItems = getMenuItems(user);
  const { sidebarOpen } = useUIState();

  if (sidebarOpen) {
    return (
      <div className="w-20 bg-background border-r flex flex-col justify-between items-center">
        <div className="w-full overflow-y-scroll overflow-x-hidden hide-scrbar">
          <Link href="/">
            <div className="logo-container mx-auto flex size-16 items-center justify-center border-b">
              <Image
                src="/assets/Logo.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
          </Link>

          <div className="icon-list flex flex-col mt-4 items-center">
            {menuItems.map((item, index) => (
              <div
                className="my-2 flex items-center w-full relative"
                key={index}
              >
                  <div className="flex-1 flex justify-center items-center">
                    <Link href={item.href}>
                      <div
                        className={`icon p-2 border w-full border-transparent hover:border-border rounded-sm transition ${
                          pathname === item.href ? "bg-primary" : ""
                        }`}
                      >
                        <item.icon size={20} />
                      </div>
                    </Link>
                  </div>
                <div
                  className={`h-10 w-1 ml-auto rounded-tl-md rounded-bl-md ${
                    pathname === item.href ? "bg-primary" : ""
                  }`}
                />
              </div>
            ))}
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="icon py-4 md:hidden"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="w-full max-md:hidden lower-container flex flex-col size-16 items-center justify-center border-b pb-16">
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="icon p-4"
          >
            <LogOut size={20} />
          </button>
        </div>

        <LogoutModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    );
  }
}
