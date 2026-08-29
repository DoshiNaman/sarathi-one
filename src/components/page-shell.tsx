import { cn } from "@/lib/utils";

/**
 * Standard page frame for every non-landing screen.
 *
 * The pages had each invented their own container width, padding and heading
 * size, so a citizen moving between them felt the layout shift. One component
 * fixes the measure and the type scale in a single place.
 */
export function PageShell({
  title,
  description,
  action,
  width = "default",
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  width?: "default" | "narrow" | "wide";
  children: React.ReactNode;
}) {
  const measure = {
    narrow: "max-w-2xl",
    default: "max-w-3xl",
    wide: "max-w-5xl",
  }[width];

  return (
    <div className={cn("mx-auto w-full px-5 py-10 sm:px-8 sm:py-14", measure)}>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-[clamp(1.9rem,4cqi,2.6rem)] leading-tight">{title}</h1>
          {description ? (
            <p className="text-muted-foreground max-w-xl leading-relaxed">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}
