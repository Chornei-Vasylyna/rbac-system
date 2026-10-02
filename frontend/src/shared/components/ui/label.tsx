import { cn } from "cn";
import type * as React from "react";

function Label({ className, ...props }: React.ComponentProps<"label">) {
    return (
        // biome-ignore lint/a11y/noLabelWithoutControl: automatically generated component
        <label
            data-slot="label"
            className={cn(
                "block text-sm font-medium text-slate-700 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export { Label };