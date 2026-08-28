import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Collection header: title, row count, and the create action. */
export function PageHeader({
  title,
  description,
  count,
  action,
}: {
  title: string;
  description?: string;
  count?: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-[1.75rem] leading-none">{title}</h1>
          {count !== undefined && (
            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs tabular-nums">
              {count}
            </span>
          )}
        </div>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
}) {
  const body = (
    <Card className={cn("h-full", href && "hover:border-pop/40 transition-colors")}>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs">{label}</CardDescription>
        <CardTitle className="font-display text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-xs">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

/** Says plainly whether a screen is reading the database or the fallback fleet. */
export function SourceBadge({ source }: { source: string }) {
  return (
    <Badge variant={source === "supabase" ? "default" : "secondary"}>
      {source === "supabase" ? "database" : "fallback fleet"}
    </Badge>
  );
}

/** Bordered list view. Rows are the unit of work, as in a CMS collection. */
export function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-muted-foreground text-left">
              {headers.map((h) => (
                <th key={h} className="px-4 py-2.5 text-xs font-medium tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-muted/40 transition-colors">{children}</tr>;
}

export function Cell({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <td className={cn("px-4 py-2.5", align === "right" && "text-right", className)}>{children}</td>
  );
}
