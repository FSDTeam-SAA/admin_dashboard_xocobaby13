"use client";

import { useEffect, useState } from "react";
import { DataTableFooter } from "@/components/dashboard/data-table-footer";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchBox } from "@/components/dashboard/search-box";
import { UserNameCell } from "@/components/dashboard/user-name-cell";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardUser, PaginationMeta, getApiErrorMessage, getUsersApi } from "@/lib/api";
import { DASHBOARD_PAGE_SIZE } from "@/lib/config";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { formatDate, formatUserRole } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: DASHBOARD_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

export default function UsersPage() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
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

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsersApi({
          page: currentPage,
          limit: DASHBOARD_PAGE_SIZE,
          search: debouncedSearch,
          includeStats: true,
        });

        if (!isMounted) return;
        setUsers(response.data || []);
        setMeta(response.meta || { ...DEFAULT_META, page: currentPage });
      } catch (error) {
        if (!isMounted) return;
        toast.error(getApiErrorMessage(error));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, [currentPage, debouncedSearch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User List"
        breadcrumb={["Dashboard", "User List"]}
        action={<SearchBox value={search} onChange={handleSearchChange} placeholder="Search for User" />}
      />

      {isLoading ? (
        <TableSkeleton rows={10} columns={5} />
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
                    <TableCell colSpan={5} className="py-10 text-center text-[#6a7787]">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="pl-8">
                        <UserNameCell name={user.fullName} avatar={user.avatar?.url} />
                      </TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="pr-8 text-right font-medium">
                        {user.service || formatUserRole(user.role)}
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
