"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "grid h-[119px] w-[120px] place-items-center rounded-[111px] border-[3px] border-[#0d3d74] bg-[radial-gradient(circle_at_30%_25%,#2f8bd6_0%,#145ca3_55%,#0c2d59_100%)] shadow-[inset_0_0_0_2px_#5ca4e6]",
          className,
        )}
      >
        <span className="text-[28px] font-black tracking-wide text-white">BOB</span>
      </div>
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="Logo Mark"
      width={120}
      height={119}
      priority
      unoptimized
      className={cn("h-[119px] w-[120px] rounded-[111px] object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}
