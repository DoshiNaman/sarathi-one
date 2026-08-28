"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, ArrowUp, Sparkles, RotateCcw } from "lucide-react";
import { useApp } from "@/lib/store";
import { KNOWLEDGE } from "@/lib/knowledge";
import { MODELS } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Turn = { role: "user" | "bot"; text: string; source?: string };

const STEP_LABEL = {
  "/check": { en: "checking a vehicle", hi: "वाहन जांचते समय" },
  "/report": { en: "reading a Trust Report", hi: "ट्रस्ट रिपोर्ट पढ़ते समय" },
  "/transfer": { en: "transferring ownership", hi: "स्वामित्व ट्रांसफर करते समय" },
  "/garage": { en: "in your garage", hi: "आपके गैराज में" },
  "/crash": { en: "at an accident scene", hi: "दुर्घटना स्थल पर" },
  "/status": { en: "tracking an application", hi: "आवेदन ट्रैक करते समय" },
} satisfies Record<string, { en: string; hi: string }>;

/**
 * Sahayak — a help panel that knows which step the citizen is on.
 *
 * The portal's own answer to this is a PDF manual and a mascot that covers the
 * page. This stays out of the way until asked, states which step it is helping
 * with, and labels whether a model or the offline rule engine replied.
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
  const scroller = useRef<HTMLDivElement>(null);

  const step = Object.entries(STEP_LABEL).find(([prefix]) => pathname.startsWith(prefix))?.[1];
  const context = step?.en ?? "";
  const suggestions = KNOWLEDGE.slice(0, 4);

  // Keep the newest reply in view as the conversation grows.
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

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
        {
          role: "bot",
          text:
            locale === "hi"
              ? "सहायक तक नहीं पहुंच सके। दोबारा कोशिश करें।"
              : "Could not reach the helper. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!open)
    return (
      <Button
        variant="pop"
        className="fixed right-4 bottom-4 z-50 h-11 rounded-full px-4 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label={locale === "hi" ? "सहायक खोलें" : "Open Sahayak help"}
      >
        <MessageCircle aria-hidden />
        {locale === "hi" ? "सहायक" : "Sahayak"}
      </Button>
    );

  return (
    <aside
      className="bg-card fixed inset-x-3 bottom-3 z-50 flex max-h-[74dvh] flex-col overflow-hidden rounded-2xl border shadow-2xl sm:inset-x-auto sm:right-4 sm:w-[380px]"
      aria-label="Sahayak help"
    >
      <header className="flex items-start gap-3 border-b px-4 py-3">
        <span className="bg-pop/12 text-pop mt-0.5 grid size-8 shrink-0 place-items-center rounded-full">
          <Sparkles aria-hidden className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[17px] leading-none">
            {locale === "hi" ? "सहायक" : "Sahayak"}
          </p>
          <p className="text-muted-foreground mt-1 truncate text-[11px]">
            {step
              ? locale === "hi"
                ? `${step.hi} मदद`
                : `While ${step.en}`
              : locale === "hi"
                ? "कागजी काम में मदद"
                : "Help with the paperwork"}
          </p>
        </div>
        {turns.length > 0 && (
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setTurns([])}
            aria-label={locale === "hi" ? "बातचीत साफ़ करें" : "Clear conversation"}
          >
            <RotateCcw aria-hidden />
          </Button>
        )}
        <Button size="icon-sm" variant="ghost" onClick={() => setOpen(false)} aria-label="Close">
          <X aria-hidden />
        </Button>
      </header>

      <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {turns.length === 0 && (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {locale === "hi"
                ? "कागजी काम के बारे में कुछ भी पूछें — हिंदी या अंग्रेज़ी में।"
                : "Ask anything about the paperwork, in Hindi or English."}
            </p>
            <div className="flex flex-col gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => send(s.q[locale])}
                  className="hover:border-pop/50 hover:bg-pop/[0.05] rounded-xl border px-3 py-2 text-left text-[13px] transition-colors"
                >
                  {s.q[locale]}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => (
          <div key={i} className={cn("flex", t.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                t.role === "user"
                  ? "bg-pop text-pop-foreground rounded-br-md"
                  : "bg-muted rounded-bl-md"
              )}
            >
              <p className="whitespace-pre-wrap">{t.text}</p>
              {t.source === "fallback" && (
                <p className="mt-1.5 text-[10px] opacity-70">
                  {locale === "hi"
                    ? "ऑफ़लाइन उत्तर — मॉडल ने जवाब नहीं दिया"
                    : "offline answer — the model did not respond"}
                </p>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="bg-muted flex gap-1 rounded-2xl rounded-bl-md px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="bg-muted-foreground/60 size-1.5 rounded-full"
                  data-typing
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <form
        className="border-t p-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          send(q);
        }}
      >
        <div className="flex items-center gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={locale === "hi" ? "अपना सवाल लिखें…" : "Type your question…"}
            aria-label={locale === "hi" ? "सवाल" : "Question"}
            className="h-10 rounded-full"
          />
          <Button
            type="submit"
            variant="pop"
            size="icon"
            className="size-10 shrink-0 rounded-full"
            disabled={busy || !q.trim()}
            aria-label={locale === "hi" ? "भेजें" : "Send"}
          >
            <ArrowUp aria-hidden />
          </Button>
        </div>

        <label className="text-muted-foreground mt-2 flex items-center gap-2 px-1 text-[10px]">
          <span className="shrink-0">{locale === "hi" ? "मॉडल" : "Model"}</span>
          <select
            className="min-w-0 flex-1 truncate bg-transparent text-[10px] outline-none"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            aria-label={locale === "hi" ? "AI मॉडल चुनें" : "Choose AI model"}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
      </form>
    </aside>
  );
}
