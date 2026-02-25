import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
}

export function StatCard({ title, value, change, trend = "up" }: StatCardProps) {
  return (
    <Card className="border-none bg-white/95 shadow-sm">
      <CardContent className="p-5">
        <p className="text-sm text-[#6a7787]">{title}</p>
        <div className="mt-2 flex items-end justify-between">
          <h3 className="text-[38px] text-3xl font-bold text-[#253548]">{value}</h3>
          {change ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-sm font-semibold",
                trend === "up" ? "text-[#1f9a5d]" : "text-[#dd3556]",
              )}
            >
              {change}
              {trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
