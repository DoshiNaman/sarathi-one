"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states";
import { useT } from "@/lib/i18n";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  useEffect(() => {
    // Surfaced in the browser console and the server logs; there is no analytics
    // pipeline in this demo to report it to.
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title={t("somethingWentWrong")}
      description={t("screenFailed")}
      action={<Button onClick={reset}>{t("tryAgain")}</Button>}
    />
  );
}
