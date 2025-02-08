import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Button } from "./Button"; // Assuming your Button component is in the same directory

const fileUploadVariants = cva(
  "relative cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const FileUploadButton = ({
  className,
  variant,
  size,
  onFileSelect,
  ...props
}) => {
  const inputRef = React.useRef(null);

  const handleFileChange = (event) => {
    if (onFileSelect && event.target.files.length > 0) {
      onFileSelect(event.target.files[0]);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        variant={variant}
        size={size}
        className={cn(fileUploadVariants({ variant, size, className }))}
        onClick={() => inputRef.current.click()}
        {...props}
      >
        Upload File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
      />
    </div>
  );
};

export { FileUploadButton };
