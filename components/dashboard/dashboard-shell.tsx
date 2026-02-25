"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

interface DashboardShellProps {
  children: React.ReactNode;
  name: string;
  email: string;
  avatar?: string;
}

export function DashboardShell({ children, name, email, avatar }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#e3e7ed]">
      {/* Desktop Sidebar (fixed) */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block md:w-[260px]">
        <Sidebar name={name} email={email} avatar={avatar} />
      </aside>

      {/* Main column */}
      <div className="md:pl-[260px]">
        {/* Topbar (fixed) */}
        <div className="fixed left-0 right-0 top-0 z-50 md:left-[260px]">
          <Topbar name={name} avatar={avatar} />
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Content (push down for topbar height) */}
        <main className=" px-4 py-6 md:px-8 md:py-6 !pt-28">
          {children}
        </main>
      </div>
    </div>
  );
}