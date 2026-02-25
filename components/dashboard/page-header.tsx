import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  breadcrumb: string[];
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, breadcrumb, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div>
        <h1 className="text-[42px] font-bold leading-tight text-[#1f2f43]">{title}</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-[#6c7887]">
          {breadcrumb.map((item, index) => (
            <span key={item} className="inline-flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>
      {action ? <div className="w-full md:w-auto">{action}</div> : null}
    </div>
  );
}
