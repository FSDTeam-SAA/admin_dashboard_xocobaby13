import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "min-h-[120px] w-full rounded-md border border-[#9eaab8] bg-white px-3 py-2 text-sm text-[#1e293b] shadow-xs outline-none placeholder:text-[#96a0aa] focus:border-[#168bd3] focus:ring-2 focus:ring-[#168bd3]/20",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
