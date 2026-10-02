import { Button } from "@/shared/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/Dialog";

type RoleDeleteDialogProps = {
	isDeleting: boolean;
	onClose: () => void;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	roleName: string | undefined;
};

export const RoleDeleteDialog = ({
	isDeleting,
	onClose,
	onConfirm,
	onOpenChange,
	open,
	roleName,
}: RoleDeleteDialogProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent showCloseButton={false}>
			<DialogHeader>
				<DialogTitle>Delete role?</DialogTitle>
				<DialogDescription>
					This will permanently delete{" "}
					<strong className="font-semibold text-slate-700">
						{roleName}
					</strong>
					. This action cannot be undone.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					disabled={isDeleting}
					onClick={onClose}
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
				<Button
					className="bg-red-600 text-white hover:bg-red-700"
					disabled={isDeleting}
					onClick={onConfirm}
					type="button"
				>
					{isDeleting ? "Deleting..." : "Delete role"}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
