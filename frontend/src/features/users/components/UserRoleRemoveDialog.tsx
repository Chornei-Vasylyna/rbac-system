import { Button } from "@/shared/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/Dialog";

type UserRoleRemoveDialogProps = {
	onClose: () => void;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	roleName: string | undefined;
	userEmail: string | undefined;
};

export const UserRoleRemoveDialog = ({
	onClose,
	onConfirm,
	onOpenChange,
	open,
	roleName,
	userEmail,
}: UserRoleRemoveDialogProps) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent showCloseButton={false}>
			<DialogHeader>
				<DialogTitle>Remove role?</DialogTitle>
				<DialogDescription>
					This will remove the{" "}
					<strong className="font-semibold text-slate-700">{roleName}</strong>{" "}
					role from{" "}
					<strong className="font-semibold text-slate-700">
						{userEmail}
					</strong>
					.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					onClick={onClose}
					type="button"
					variant="outline"
				>
					Cancel
				</Button>
				<Button
					className="bg-red-600 text-white hover:bg-red-700"
					onClick={onConfirm}
					type="button"
				>
					Remove role
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
