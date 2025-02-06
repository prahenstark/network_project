import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      checked: {
        true: "bg-primary",
        false: "bg-destructive",
      },
    },
  }
);

const thumbVariants = cva(
  "absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform duration-300",
  {
    variants: {
      checked: {
        true: "translate-x-5",
        false: "translate-x-0",
      },
    },
  }
);

const ToggleSwitch = React.forwardRef(
  ({ className, checked, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-block w-11 h-6 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <span className={cn(toggleVariants({ checked, className }))}>
          <span className={cn(thumbVariants({ checked }))} />
        </span>
      </label>
    );
  }
);

ToggleSwitch.displayName = "ToggleSwitch";

export { ToggleSwitch };
