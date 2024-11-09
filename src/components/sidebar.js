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

// Define the menu items as an array of objects
const menuItems = [
  { href: "/", icon: LayoutDashboardIcon },
  { href: "/devices", icon: WifiIcon },
  { href: "/projects", icon: FolderIcon },
  { href: "/maintainance", icon: ShieldAlertIcon },
  { href: "/app-auth", icon: LockIcon },
  // The Accounts link will be conditionally added
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth(); // Assuming useAuth provides the user object

  // Conditionally add the Accounts link based on the user's role
  if (user && user.role === "vendor") {
    const exists = menuItems.some(item => item.href === "/accounts");
    if (!exists) {
      menuItems.push({ href: "/accounts", icon: UsersIcon });
    }
  }
  

  return (
    <div className="w-20 bg-background border-r flex flex-col justify-between items-center">
      <div className="w-full">
        <Link href="/">
          <div className="logo-container mx-auto flex size-16 items-center justify-center border-b">
            <img src="/assets/Logo.png" alt="Logo" />
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

        <Link href="/log-out">
          <div className="icon p-4 w-full ">
            <LogOut size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
}
