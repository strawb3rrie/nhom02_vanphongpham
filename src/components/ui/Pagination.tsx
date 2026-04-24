import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 pr-2.5 h-9 px-4 disabled:opacity-50 hover:bg-muted rounded-md transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Trang trước</span>
          </button>
        </li>

        {/* Generate page numbers - simplified strategy */}
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isCurrentPage = page === currentPage;
          
          return (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                aria-current={isCurrentPage ? "page" : undefined}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-md transition-colors",
                  isCurrentPage 
                    ? "bg-primary text-primary-foreground font-medium" 
                    : "hover:bg-muted"
                )}
              >
                {page}
              </button>
            </li>
          );
        })}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 pl-2.5 h-9 px-4 disabled:opacity-50 hover:bg-muted rounded-md transition-colors"
          >
            <span>Trang sau</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
