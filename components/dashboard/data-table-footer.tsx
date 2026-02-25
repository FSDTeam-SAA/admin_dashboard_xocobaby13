import { PaginationControls } from "@/components/shared/pagination-controls";

interface DataTableFooterProps {
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getRangeLabel = (currentPage: number, pageSize: number, totalResults: number) => {
  if (!totalResults) return "Showing 0-0 of 0 results";
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalResults);
  return `Showing ${start}-${end} of ${totalResults} results`;
};

export function DataTableFooter({
  currentPage,
  pageSize,
  totalResults,
  totalPages,
  onPageChange,
}: DataTableFooterProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#dce3ec] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-[#56657a]">{getRangeLabel(currentPage, pageSize, totalResults)}</p>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
