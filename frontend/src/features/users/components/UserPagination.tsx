import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

type UserPaginationProps = {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export const UserPagination = ({
	page,
	totalPages,
	onPageChange,
}: UserPaginationProps) => {
	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
			<span className="text-xs text-slate-500">
				Page {page} of {totalPages}
			</span>
			<div className="flex gap-1">
				<Button
					aria-label="Previous page"
					disabled={page === 1}
					onClick={() => onPageChange(page - 1)}
					size="icon"
					title="Previous page"
					variant="outline"
				>
					<ChevronLeft className="size-4" />
				</Button>
				<Button
					aria-label="Next page"
					disabled={page === totalPages}
					onClick={() => onPageChange(page + 1)}
					size="icon"
					title="Next page"
					variant="outline"
				>
					<ChevronRight className="size-4" />
				</Button>
			</div>
		</div>
	);
};
