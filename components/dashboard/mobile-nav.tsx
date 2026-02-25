"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/users", label: "Users" },
  { href: "/commission-report", label: "Commission" },
  { href: "/settings", label: "Settings" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-[#d4dce6] bg-[#d3e5f6] px-3 py-3 md:hidden">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-[#1f2f43]",
            pathname.startsWith(link.href) && "bg-[#168bd3] text-white",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
