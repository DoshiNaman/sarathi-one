import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The shared empty / error / loading vocabulary.
 *
 * Every screen used to invent its own "nothing here" line, so the same idea read
 * five different ways. One component each keeps the tone consistent and makes a
 * missing state obvious in review.
 */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {icon ? <div className="text-muted-foreground/60 [&_svg]:size-8">{icon}</div> : null}
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? (
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className="border-danger/30 bg-danger-muted/40 flex flex-col items-center gap-3 rounded-xl border px-6 py-12 text-center"
    >
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? (
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Inline spinner for buttons and small pending regions. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current/30 border-t-current align-[-2px]",
        className
      )}
    />
  );
}

export function CardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-4" style={{ width: `${92 - i * 9}%` }} />
        ))}
      </CardContent>
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <CardSkeleton />
      <div className="grid gap-4 sm:grid-cols-2">
        <CardSkeleton rows={3} />
        <CardSkeleton rows={3} />
      </div>
    </div>
  );
}
