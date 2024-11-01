"use client"

import { LayoutDashboardIcon } from "lucide-react";
import { FolderIcon } from "lucide-react";
import { UsersIcon } from "lucide-react";
import { LockIcon } from "lucide-react";
import { ShieldAlertIcon } from "lucide-react";
import { WifiIcon } from "lucide-react";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";


export default function Sidebar({}) {
  return (
    <div className="w-20 bg-background border-r flex flex-col justify-between items-center">
      <div>
        <Link href={"/"}>
          <div className="logo-container flex size-16 items-center justify-center border-b">
            <img src="/logo.svg" alt="logo" />
          </div>
        </Link>

        <div className="icon-list flex flex-col mt-4 items-center">
          <Link className="my-2" href={"/"}>
            <div className="icon p-2 border w-full border-transparent hover:border-border rounded-sm transition">
              <LayoutDashboardIcon size={20} />
            </div>
          </Link>
          <Link className="my-2" href={"/devices"}>
            <div className="icon p-2 border border-transparent hover:border-border rounded-sm transition">
              <WifiIcon size={20} />
            </div>
          </Link>
          <Link className="my-2" href={"/projects"}>
            <div className="icon p-2 border border-transparent hover:border-border rounded-sm transition">
              <FolderIcon size={20} />
            </div>
          </Link>
          <Link className="my-2" href={"/maintainance"}>
            <div className="icon p-2 border border-transparent hover:border-border rounded-sm transition">
              <ShieldAlertIcon size={20} />
            </div>
          </Link>
          <Link className="my-2" href={"/auth"}>
            <div className="icon p-2 border border-transparent hover:border-border rounded-sm transition">
              <LockIcon size={20} />
            </div>
          </Link>
          <Link className="my-2" href={"/accounts"}>
            <div className="icon p-2 border border-transparent hover:border-border rounded-sm transition">
              <UsersIcon size={20} />
            </div>
          </Link>
        </div>
      </div>

      <div className="swtings-container flex size-16 items-center justify-center border-b">
        <Link href={"/settings"}><SettingsIcon size={20} /></Link>
      </div>

    </div>
  );
}