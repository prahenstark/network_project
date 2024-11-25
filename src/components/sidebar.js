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
import { useAuth } from "@/context/auth-provider"; // Adjust the import path based on your project structure
import { LogOut } from "lucide-react";
import LogoutModal from "./logout-modal";
import { useState } from "react";
import Image from "next/image";
import { useUIState } from "@/hooks/use-uiState";
import { RouterIcon } from "lucide-react";
import { MonitorSmartphoneIcon } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth(); // Assuming useAuth provides the user object
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getMenuItems = (user) => {
    const items = [
      { href: "/", icon: LayoutDashboardIcon },
      { href: "/devices", icon: RouterIcon },
      { href: "/all-devices", icon: MonitorSmartphoneIcon },
      { href: "/projects", icon: FolderIcon },
      { href: "/maintainance", icon: ShieldAlertIcon },
      { href: "/app-auth", icon: LockIcon },
    ];
    if (user && user.role === "vendor") {
      items.push({ href: "/accounts", icon: UsersIcon });
    }
    return items;
  };

  const menuItems = getMenuItems(user);

  const { sidebarOpen } = useUIState();

  if (sidebarOpen) {
    return (
      <div className="w-20 bg-background border-r flex flex-col justify-between items-center">
        <div className="w-full">
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
              <div className="my-2 flex items-center w-full" key={index}>
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
                {/* Change bg color if active */}
                <div
                  className={`h-10 w-1 ml-auto rounded-tl-md rounded-bl-md ${
                    pathname === item.href ? "bg-primary" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lower-container flex flex-col size-16 items-center justify-center border-b pb-16">
          <Link href="/settings">
            <div className="icon p-4 w-full ">
              <SettingsIcon size={20} />
            </div>
          </Link>

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
