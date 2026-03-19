import * as React from "react";

import { cn } from "./utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string;
};

function Textarea({ className, label, id, ...props }: TextareaProps) {
  const textarea = (
    <textarea
      id={id}
      data-slot="textarea"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );

  if (!label) {
    return textarea;
  }

  return (
    <label className="block space-y-1.5">
      <span className="block text-sm font-medium text-gray-700">{label}</span>
      {textarea}
    </label>
  );
}

export { Textarea, Textarea as TextArea };
