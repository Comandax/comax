
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductListPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductListPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <PaginationPrevious />
            </Button>
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <Button
                variant={currentPage === page ? "default" : "ghost"}
                className={currentPage === page ? "pointer-events-none" : ""}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <PaginationNext />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
