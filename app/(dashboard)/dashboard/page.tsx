"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { DataTableFooter } from "@/components/dashboard/data-table-footer";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { SearchBox } from "@/components/dashboard/search-box";
import { StatCard } from "@/components/dashboard/stat-card";
import { UserNameCell } from "@/components/dashboard/user-name-cell";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardOverview, getApiErrorMessage, getDashboardOverviewApi } from "@/lib/api";
import { cn, formatDate, formatMoney, formatUserRole } from "@/lib/utils";
import { toast } from "sonner";

const SALES_PERIODS = ["12 Months", "6 Months", "30 Days", "7 Days"] as const;

const FALLBACK_OVERVIEW: DashboardOverview = {
  metrics: {
    totalFisherman: 0,
    totalSpotOwner: 0,
    totalRunningEvents: 0,
    totalEarnings: 0,
    commissionRate: 0.15,
  },
  salesReport: [],
  recentUsers: [],
};

const FALLBACK_MONTHS = [
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
];

export default function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview>(FALLBACK_OVERVIEW);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activePeriod, setActivePeriod] = useState<(typeof SALES_PERIODS)[number]>("12 Months");

  useEffect(() => {
    let isMounted = true;

    const loadOverview = async () => {
      try {
        setIsLoading(true);
        const response = await getDashboardOverviewApi();
        if (!isMounted) return;
        setOverview(response.data || FALLBACK_OVERVIEW);
      } catch (error) {
        if (!isMounted) return;
        toast.error(getApiErrorMessage(error));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const users = useMemo(() => {
    const source = overview.recentUsers || [];
    const query = search.trim().toLowerCase();
    if (!query) return source.slice(0, 10);

    return source
      .filter((user) =>
        [user.fullName, user.email, user.phone, formatUserRole(user.role)]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 10);
  }, [overview.recentUsers, search]);

  const salesData =
    overview.salesReport?.length > 0
      ? overview.salesReport
      : FALLBACK_MONTHS.map((month) => ({ month, total: 0 }));

  return (
    <div className="space-y-5">
     

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Fisherman" value={String(overview.metrics.totalFisherman || 0)} change="+ 36%" trend="up" />
        <StatCard title="Total Spot Owner" value={String(overview.metrics.totalSpotOwner || 0)} change="- 14%" trend="down" />
        <StatCard title="Total Running Events" value={String(overview.metrics.totalRunningEvents || 0)} />
        <StatCard title="Total Earnings" value={formatMoney(overview.metrics.totalEarnings || 0)} change="+ 36%" trend="up" />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[30px] text-2xl font-semibold text-[#1f2f43]">Sales Report</h2>
            <div className="flex flex-wrap items-center gap-2">
              {SALES_PERIODS.map((period) => (
                <button
                  key={period}
                  type="button"
                  className={cn(
                    "h-9 rounded-md border border-transparent px-3 text-sm font-semibold text-[#617083] transition-colors",
                    activePeriod === period && "border-[#a9b8c9] bg-white text-[#1f2f43]",
                  )}
                  onClick={() => setActivePeriod(period)}
                >
                  {period}
                </button>
              ))}
              <Button variant="outline" className="h-9 px-4 text-xs">
                <FileText className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
          <SalesChart data={salesData} />
        </CardContent>
      </Card>

      {isLoading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8">User Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="pr-8 text-right">Services</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell className="py-8 text-center text-[#6a7787]" colSpan={5}>
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="pl-8">
                        <UserNameCell name={user.fullName} avatar={user.avatar} />
                      </TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.joinDate)}</TableCell>
                      <TableCell className="pr-8 text-right font-medium">{formatUserRole(user.role)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <DataTableFooter
              currentPage={1}
              pageSize={users.length || 10}
              totalResults={users.length}
              totalPages={1}
              onPageChange={() => undefined}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
