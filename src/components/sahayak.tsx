"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { KNOWLEDGE } from "@/lib/knowledge";
import { MODELS } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Turn = { role: "user" | "bot"; text: string; source?: string };

const STEP_LABEL = {
  "/check": "checking a vehicle before buying it",
  "/report": "reading a vehicle's Trust Report",
  "/transfer": "completing a transfer of ownership",
  "/garage": "looking at their own vehicles and applications",
  "/crash": "at the scene of a road accident",
  "/status": "tracking an application",
} satisfies Record<string, string>;

/**
 * Sahayak — a help panel that knows which step the citizen is on. Today's portal
 * answers questions like this with a PDF manual and a mascot that covers the page.
 */
export function Sahayak() {
  const pathname = usePathname();
  const locale = useApp((s) => s.locale);
  const model = useApp((s) => s.model);
  const setModel = useApp((s) => s.setModel);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);

  const context =
    Object.entries(STEP_LABEL).find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "";
  const suggestions = KNOWLEDGE.slice(0, 4);

  async function send(question: string) {
    if (!question.trim() || busy) return;
    setTurns((t) => [...t, { role: "user", text: question }]);
    setQ("");
    setBusy(true);
    try {
      const res = await fetch("/api/sahayak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale, context, model }),
      });
      const data = await res.json();
      setTurns((t) => [
        ...t,
        { role: "bot", text: data.answer ?? "Something went wrong.", source: data.source },
      ]);
    } catch {
      setTurns((t) => [
        ...t,
        { role: "bot", text: "Could not reach the helper. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!open)
    return (
      <Button
        className="fixed right-4 bottom-4 z-50 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label={locale === "hi" ? "सहायक खोलें" : "Open Sahayak help"}
      >
        💬 {locale === "hi" ? "सहायक" : "Sahayak"}
      </Button>
    );

  return (
    <aside
      className="bg-card fixed inset-x-2 bottom-2 z-50 flex max-h-[70dvh] flex-col rounded-xl border shadow-xl sm:inset-x-auto sm:right-4 sm:w-96"
      aria-label="Sahayak help"
    >
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <span className="font-semibold">💬 {locale === "hi" ? "सहायक" : "Sahayak"}</span>
        <span className="text-muted-foreground text-xs">
          {context ? (locale === "hi" ? "इस चरण के लिए" : "for this step") : ""}
        </span>
        <Button
          size="icon-sm"
          variant="ghost"
          className="ml-auto"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          ✕
        </Button>
      </header>

      <div className="border-b px-3 py-1.5">
        <label className="text-muted-foreground flex items-center gap-2 text-[11px]">
          <span className="shrink-0">{locale === "hi" ? "AI मॉडल" : "AI model"}</span>
          <select
            className="bg-background min-w-0 flex-1 rounded border px-1.5 py-1 text-[11px]"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
        {turns.length === 0 && (
          <>
            <p className="text-muted-foreground">
              {locale === "hi"
                ? "कागजी काम के बारे में कुछ भी पूछें। कुछ सामान्य सवाल:"
                : "Ask anything about the paperwork. Common questions:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="hover:bg-muted rounded-full border px-2.5 py-1 text-xs"
                  onClick={() => send(s.q[locale])}
                >
                  {s.q[locale]}
                </button>
              ))}
            </div>
          </>
        )}
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "text-right" : ""}>
            <span
              className={`inline-block max-w-[85%] rounded-lg px-2.5 py-1.5 text-left ${
                t.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {t.text}
              {t.source === "fallback" && (
                <span className="mt-1 block text-[10px] opacity-70">
                  offline answer — the model did not respond
                </span>
              )}
            </span>
          </div>
        ))}
        {busy && <p className="text-muted-foreground">…</p>}
      </div>

      <form
        className="flex gap-2 border-t p-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(q);
        }}
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={locale === "hi" ? "अपना सवाल लिखें…" : "Type your question…"}
          aria-label={locale === "hi" ? "सवाल" : "Question"}
        />
        <Button type="submit" disabled={busy || !q.trim()}>
          →
        </Button>
      </form>
    </aside>
  );
}
