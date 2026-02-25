"use client";

import { useEffect, useState } from "react";
import { DataTableFooter } from "@/components/dashboard/data-table-footer";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchBox } from "@/components/dashboard/search-box";
import { UserNameCell } from "@/components/dashboard/user-name-cell";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommissionRow, PaginationMeta, getApiErrorMessage, getCommissionReportApi } from "@/lib/api";
import { DASHBOARD_PAGE_SIZE } from "@/lib/config";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { formatMoney } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: DASHBOARD_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

export default function CommissionReportPage() {
  const [rows, setRows] = useState<CommissionRow[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 350);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    let isMounted = true;

    const loadReport = async () => {
      try {
        setIsLoading(true);
        const response = await getCommissionReportApi({
          page: currentPage,
          limit: DASHBOARD_PAGE_SIZE,
          search: debouncedSearch,
        });

        if (!isMounted) return;
        setRows(response.data || []);
        setMeta(response.meta || { ...DEFAULT_META, page: currentPage });
      } catch (error) {
        if (!isMounted) return;
        toast.error(getApiErrorMessage(error));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadReport();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Commission Report"
        breadcrumb={["Dashboard", "Commission Report"]}
        action={<SearchBox value={search} onChange={handleSearchChange} placeholder="Search..." />}
      />

      {isLoading ? (
        <TableSkeleton rows={10} columns={4} />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-white">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-8">Owner Name</TableHead>
                  <TableHead>Total Event</TableHead>
                  <TableHead>Total Earnings</TableHead>
                  <TableHead className="pr-8 text-right">Platform Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-[#6a7787]">
                      No commission records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.ownerId}>
                      <TableCell className="pl-8">
                        <UserNameCell name={row.ownerName} avatar={row.ownerAvatar} />
                      </TableCell>
                      <TableCell>{row.totalEvents}</TableCell>
                      <TableCell>{formatMoney(row.totalEarnings)}</TableCell>
                      <TableCell className="pr-8 text-right font-medium">
                        {formatMoney(row.platformCommission)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <DataTableFooter
              currentPage={meta.page || currentPage}
              pageSize={meta.limit || DASHBOARD_PAGE_SIZE}
              totalResults={meta.total || 0}
              totalPages={Math.max(meta.totalPages || 1, 1)}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
