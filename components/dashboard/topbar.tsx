"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBox } from "./search-box";

interface TopbarProps {
  name: string;
  avatar?: string;
}

export function Topbar({ name, avatar }: TopbarProps) {
  const [search, setSearch] = React.useState("");

  return (
    <header className="flex h-[72px] items-center justify-end bg-[linear-gradient(90deg,#b9d5ef_0%,#e5edf6_100%)] px-4 md:px-6">

      {/* Profile */}
      <div className="flex items-center gap-3">
        <span className="text-base font-semibold text-[#1f2f43]">{name}</span>
        <Avatar className="h-10 w-10 border border-[#b7cadf]">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}