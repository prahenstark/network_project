"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, FolderIcon, UsersIcon, LockIcon, ShieldAlertIcon, WifiIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

// Define the menu items as an array of objects
const menuItems = [
  { href: "/", icon: LayoutDashboardIcon },
  { href: "/devices", icon: WifiIcon },
  { href: "/projects", icon: FolderIcon },
  { href: "/maintainance", icon: ShieldAlertIcon },
  { href: "/auth", icon: LockIcon },
  { href: "/accounts", icon: UsersIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-20 bg-background border-r flex flex-col justify-between items-center">
      <div className="w-full">
        <Link href="/">
          <div className="logo-container mx-auto flex size-16 items-center justify-center border-b">
            <img src="/assets/Logo.png" alt="" />
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
              <div className={`h-10 w-1 ml-auto rounded-tl-md rounded-bl-md ${pathname === item.href ? "bg-primary" : ""}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="settings-container flex size-16 items-center justify-center border-b">
        <Link href="/settings">
          <SettingsIcon size={20} />
        </Link>
      </div>
    </div>
  );
}
