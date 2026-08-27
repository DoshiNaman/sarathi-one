"use client";
import { Button } from "@/components/ui/button";

/**
 * Submit button that requires an explicit confirmation first. Used for deletes,
 * which cascade to owners and challans and cannot be undone.
 */
export function ConfirmSubmit({
  message,
  children,
}: {
  message: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="xs"
      variant="destructive"
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
