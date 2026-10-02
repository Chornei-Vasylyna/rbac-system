import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label.tsx";

type UserSearchHeaderProps = {
	search: string;
	total: number;
	onSearchChange: (search: string) => void;
};

export const UserSearchHeader = ({
	search,
	total,
	onSearchChange,
}: UserSearchHeaderProps) => (
	<div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
		<div className="relative w-full sm:max-w-sm">
			<Label className="sr-only" htmlFor="user-search">
				Search users by email
			</Label>
			<Search
				aria-hidden="true"
				className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
			/>
			<Input
				aria-label="Search users by email"
				className="h-9 pl-9"
				id="user-search"
				onChange={(event) => onSearchChange(event.target.value)}
				placeholder="Search by email"
				value={search}
			/>
		</div>
		<span className="text-xs text-slate-500">{total} records</span>
	</div>
);
