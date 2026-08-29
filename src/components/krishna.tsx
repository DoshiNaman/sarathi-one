"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { X, ArrowUp, ArrowUpRight, RotateCcw, CornerDownRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { useT, type TKey } from "@/lib/i18n";
import { asksFor } from "@/lib/asks";
import { MODELS } from "@/lib/models";
import type { KrishnaAction } from "@/lib/krishna";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Feather } from "@/components/feather";
import { KrishnaThought } from "@/components/krishna-thought";
import { announceLayoutChange } from "@/lib/relayout";
import { cn } from "@/lib/utils";

type Turn = { role: "user" | "bot"; text: string; source?: string; action?: KrishnaAction | null };

/**
 * Which step of the journey each route is, in one list.
 *
 * `key` names the line shown in the panel header, translated. `context` is the
 * English phrasing sent to the model as grounding, which stays English in every
 * locale because it is prompt text, not UI. `opening` is what Krishna says when
 * the panel opens on that route — the portal's own helper says the same thing
 * everywhere, which is how you can tell it is not reading the page.
 */
const STEPS = [
  { prefix: "/check", key: "ctxCheck", context: "checking a vehicle", opening: "greetCheck" },
  {
    prefix: "/report",
    key: "ctxReport",
    context: "reading a Trust Report",
    opening: "greetReport",
  },
  {
    prefix: "/transfer",
    key: "ctxTransfer",
    context: "transferring ownership",
    opening: "greetTransfer",
  },
  { prefix: "/garage", key: "ctxGarage", context: "in your garage", opening: "greetGarage" },
  { prefix: "/crash", key: "ctxCrash", context: "at an accident scene", opening: "greetCrash" },
  {
    prefix: "/status",
    key: "ctxStatus",
    context: "tracking an application",
    opening: "greetStatus",
  },
  {
    prefix: "/services",
    key: "ctxServices",
    context: "browsing the other RTO services",
    opening: "greetServices",
  },
] satisfies { prefix: string; key: TKey; context: string; opening: TKey }[];

/**
 * Krishna — the helper, named for the charioteer.
 *
 * Sarathi means charioteer, and the charioteer in the story is the one who
 * knows the ground while the man in the chariot makes the call. That is the
 * whole design brief for this panel: it reads the screen you are on, it can
 * take the reins and drive you to another one, and it never presses the button
 * that costs you money.
 *
 * One component, three shapes. A docked column beside the page on a desktop or
 * a landscape iPad, a full-height sheet on a portrait iPad, a bottom sheet on a
 * phone — where thirty per cent of the width would be about 120px and unusable.
 */
export function Krishna() {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useApp((s) => s.locale);
  const model = useApp((s) => s.model);
  const setModel = useApp((s) => s.setModel);
  const setPrefill = useApp((s) => s.setPrefill);
  const setFlute = useApp((s) => s.setFlute);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const step = STEPS.find((s) => pathname.startsWith(s.prefix));
  const context = step?.context ?? "";
  const asks = asksFor(pathname);

  // The page reserves room for the panel instead of being covered by it, but
  // only where there is room to reserve. A data attribute on the root keeps
  // that rule in the stylesheet with the rest of the layout.
  useEffect(() => {
    document.documentElement.dataset.krishna = open ? "open" : "closed";
    // Docking changes how wide the page is, and a pinned section cannot see
    // that for itself.
    announceLayoutChange();
    return () => {
      delete document.documentElement.dataset.krishna;
      announceLayoutChange();
    };
  }, [open]);

  // Opening the panel is the gesture browsers require before audio may play, so
  // the flute can start here where it could never start on load.
  useEffect(() => {
    if (open) setFlute(true);
  }, [open, setFlute]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  function steer(action: KrishnaAction) {
    if (action.prefill) setPrefill(action.prefill);
    if (action.goto) router.push(action.goto);
  }

  async function send(question: string) {
    if (!question.trim() || busy) return;
    setTurns((prev) => [...prev, { role: "user", text: question }]);
    setQ("");
    setBusy(true);
    try {
      const res = await fetch("/api/krishna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale, context, model }),
      });
      const data = await res.json();
      setTurns((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer ?? t("krishnaFailed"),
          source: data.source,
          action: data.action ?? null,
        },
      ]);
    } catch {
      setTurns((prev) => [...prev, { role: "bot", text: t("krishnaUnreachable") }]);
    } finally {
      setBusy(false);
    }
  }

  // The hero's "ask Krishna" field posts a question here rather than holding a
  // second copy of this conversation. The listener reads the newest send through
  // a ref, so it binds once and still sees the current locale and model.
  const latestSend = useRef(send);
  useEffect(() => {
    latestSend.current = send;
  });

  useEffect(() => {
    function onAsk(e: Event) {
      // SAFETY: the only dispatcher of "krishna:ask" is this app, and both call
      // sites send a CustomEvent carrying a string.
      const question = (e as CustomEvent<string>).detail;
      setOpen(true);
      if (question) void latestSend.current(question);
    }
    window.addEventListener("krishna:ask", onAsk);
    return () => window.removeEventListener("krishna:ask", onAsk);
  }, []);

  if (!open)
    return (
      <div className="fixed right-4 bottom-4 z-50 flex max-w-[min(88vw,20rem)] flex-col items-end gap-2.5">
        {/* The only part of the product that speaks before it is spoken to. */}
        <KrishnaThought />

        <Button
          variant="pop"
          data-glow
          className="h-12 shrink-0 gap-2 rounded-full pr-5 pl-2 shadow-lg"
          onClick={() => setOpen(true)}
          aria-label={t("krishnaOpen")}
        >
          <Avatar className="size-8" />
          {t("krishna")}
        </Button>
      </div>
    );

  return (
    <>
      {/* Below xl the panel floats over the page instead of docking beside it,
          so it needs a scrim: without one the page behind stays live and the
          sheet reads as a broken layout rather than a thing you can dismiss. */}
      <button
        type="button"
        aria-label={t("krishnaClose")}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] xl:hidden"
      />

      <aside
        data-krishna-panel
        className={cn(
          "bg-card fixed z-50 flex flex-col overflow-hidden border shadow-2xl",
          // phone: a bottom sheet
          "inset-x-0 bottom-0 max-h-[80dvh] rounded-t-2xl",
          // tablet: a sheet down the right edge, still over the page
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[min(380px,86vw)] sm:rounded-none sm:border-y-0",
          // only from xl is there room to dock and let the page keep its layout
          "xl:w-[min(30vw,480px)]"
        )}
        aria-label={t("krishna")}
      >
        {/* The sky, blended into the card rather than laid on top of it: the
          conversation has to stay the most readable thing in the panel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[url('/krishna/sky.jpg')] bg-cover bg-center opacity-[0.07] mix-blend-luminosity"
        />
        <div
          aria-hidden
          className="from-card via-card/85 to-card pointer-events-none absolute inset-0 bg-gradient-to-b"
        />

        <header className="relative flex items-start gap-3 border-b px-4 py-3">
          <Avatar className="mt-0.5 size-9" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[17px] leading-none">{t("krishna")}</p>
            <p className="text-muted-foreground mt-1 truncate text-[11px]">
              {step ? t(step.key) : t("krishnaIdle")}
            </p>
          </div>
          {turns.length > 0 && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setTurns([])}
              aria-label={t("krishnaClear")}
            >
              <RotateCcw aria-hidden />
            </Button>
          )}
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setOpen(false)}
            aria-label={t("krishnaClose")}
          >
            <X aria-hidden />
          </Button>
        </header>

        <div ref={scroller} className="relative flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {turns.length === 0 && (
            <div className="space-y-3">
              {/* The opening line names this screen, so the first thing a citizen
                reads is proof the panel is looking at the same page they are. */}
              <div className="bg-muted flex gap-2.5 rounded-2xl rounded-bl-md px-3.5 py-3">
                <Feather className="text-pop mt-0.5 size-4 shrink-0" />
                <p className="text-[13px] leading-relaxed">
                  {step ? t(step.opening) : t("greetDefault")}
                </p>
              </div>
              <p className="text-muted-foreground px-1 pt-1 text-[10px] font-medium tracking-[0.14em] uppercase">
                {t("tryAsking")}
              </p>
              <div className="flex flex-col gap-1.5">
                {asks.map((a) => (
                  <button
                    key={a.en}
                    onClick={() => send(a[locale])}
                    className="hover:border-pop/50 hover:bg-pop/[0.05] group/ask flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] transition-colors"
                  >
                    <span className="flex-1">{a[locale]}</span>
                    <ArrowUpRight
                      aria-hidden
                      className="text-muted-foreground/50 group-hover/ask:text-pop size-3.5 shrink-0 transition-all group-hover/ask:translate-x-0.5 group-hover/ask:-translate-y-0.5"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {turns.map((turn, i) => (
            <div
              key={i}
              className={cn("flex", turn.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                  turn.role === "user"
                    ? "bg-pop text-pop-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                )}
              >
                <p className="whitespace-pre-wrap">{turn.text}</p>
                {turn.source === "fallback" && (
                  <p className="mt-1.5 text-[10px] opacity-70">{t("krishnaOffline")}</p>
                )}
                {/* Krishna offers the turn; the citizen takes it. Steering on its
                  own would move the page out from under someone mid-read. */}
                <Steer action={turn.action} onSteer={steer} label={t("krishnaTakeMe")} />
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
          className="relative border-t p-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            send(q);
          }}
        >
          <div className="flex items-center gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("krishnaPlaceholder")}
              aria-label={t("krishnaQuestion")}
              className="h-10 rounded-full"
            />
            <Button
              type="submit"
              variant="pop"
              size="icon"
              className="size-10 shrink-0 rounded-full"
              disabled={busy || !q.trim()}
              aria-label={t("krishnaSend")}
            >
              <ArrowUp aria-hidden />
            </Button>
          </div>

          <label className="text-muted-foreground mt-2 flex items-center gap-2 px-1 text-[10px]">
            <span className="shrink-0">{t("modelLabel")}</span>
            <select
              className="min-w-0 flex-1 truncate bg-transparent text-[10px] outline-none"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              aria-label={t("chooseModel")}
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
    </>
  );
}

/**
 * Krishna offers the turn; the citizen takes it. Steering on its own would move
 * the page out from under someone who is still reading it.
 */
function Steer({
  action,
  onSteer,
  label,
}: {
  action?: KrishnaAction | null;
  onSteer: (a: KrishnaAction) => void;
  label: string;
}) {
  if (!action?.goto) return null;
  return (
    <Button size="sm" variant="outline" className="mt-2.5" onClick={() => onSteer(action)}>
      <CornerDownRight aria-hidden />
      {label} {action.goto}
    </Button>
  );
}

/** The illustration, on the cream disc it was drawn against. */
function Avatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "ring-pop/25 grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#fdfbf5] ring-1",
        className
      )}
    >
      <Image src="/krishna/avatar.jpg" alt="" width={64} height={64} className="size-full" />
    </span>
  );
}
