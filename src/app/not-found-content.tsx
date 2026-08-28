"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states";
import { useT } from "@/lib/i18n";

/** Client half of the 404, so its copy can follow the locale toggle. */
export function NotFoundContent() {
  const t = useT();
  return (
    <EmptyState
      title={t("pageMissing")}
      description={t("pageMissingBody")}
      action={
        <Button nativeButton={false} render={<Link href="/" />}>
          {t("goHome")}
        </Button>
      }
    />
  );
}
