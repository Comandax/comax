
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

interface UserListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UserListPagination({
  currentPage,
  totalPages,
  onPageChange,
}: UserListPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-primary/30 hover:bg-primary/10 text-primary"
          >
            Anterior
          </Button>
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <Button
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => onPageChange(page)}
              className={currentPage === page 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "border-primary/30 hover:bg-primary/10 text-primary"
              }
            >
              {page}
            </Button>
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="outline"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-primary/30 hover:bg-primary/10 text-primary"
          >
            Próximo
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
