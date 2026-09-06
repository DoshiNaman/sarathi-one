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
  align = "start",
  dense = false,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  width?: "default" | "narrow" | "wide" | "full";
  /** Centre the header over the content — for a screen whose only job is one field. */
  align?: "start" | "center";
  /** Tighter frame for a screen whose content has to fit without scrolling. */
  dense?: boolean;
  children: React.ReactNode;
}) {
  const measure = {
    narrow: "max-w-2xl",
    default: "max-w-3xl",
    wide: "max-w-5xl",
    full: "max-w-7xl",
  }[width];

  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        dense ? "py-6 sm:py-8" : "py-10 sm:py-14",
        measure
      )}
    >
      <header
        className={cn(
          "flex flex-wrap gap-4",
          dense ? "mb-5" : "mb-8",
          align === "center" ? "flex-col items-center text-center" : "items-start justify-between"
        )}
      >
        <div className="space-y-2">
          <h1
            className={cn(
              "font-display leading-tight",
              dense ? "text-[clamp(1.5rem,3cqi,2rem)]" : "text-[clamp(1.9rem,4cqi,2.6rem)]"
            )}
          >
            {title}
          </h1>
          {description ? (
            <p
              className={cn(
                "text-muted-foreground max-w-xl leading-relaxed",
                align === "center" && "mx-auto"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </header>
      {children}
    </div>
  );
}
