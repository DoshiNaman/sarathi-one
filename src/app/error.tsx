"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the browser console and the server logs; there is no analytics
    // pipeline in this demo to report it to.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      description="This screen failed to load. Trying again usually fixes it."
      action={<Button onClick={reset}>Try again</Button>}
    />
  );
}
