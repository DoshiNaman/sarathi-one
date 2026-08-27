"use client";

export function StageTracker({ stages, current }: { stages: string[]; current: number }) {
  return (
    <ol className="space-y-2">
      {stages.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                state === "done"
                  ? "bg-green-600 text-white"
                  : state === "active"
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {state === "done" ? "✓" : i + 1}
            </span>
            <span
              className={
                state === "active"
                  ? "font-semibold"
                  : state === "todo"
                    ? "text-muted-foreground"
                    : ""
              }
            >
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function MockTag({ label = "MOCK" }: { label?: string }) {
  return (
    <span className="rounded border border-dashed border-orange-400 px-1.5 py-0.5 font-mono text-[10px] text-orange-600 dark:text-orange-400">
      {label}
    </span>
  );
}
