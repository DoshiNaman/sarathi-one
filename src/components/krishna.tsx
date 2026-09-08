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
import { Item, ItemContent, ItemMedia } from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Feather } from "@/components/feather";
import { KrishnaThought } from "@/components/krishna-thought";
import { announceLayoutChange } from "@/lib/relayout";
import { cn } from "@/lib/utils";

type Turn = { role: "user" | "bot"; text: string; source?: string; action?: KrishnaAction | null };

/**
 * Base UI reads the trigger's label out of `items`. Without it the trigger
 * prints the raw value — which for a model is its OpenRouter id, so the
 * footnote read `dots-studio/dots-3-note-preview:free`.
 */
const MODEL_ITEMS = MODELS.map((m) => ({ value: m.id, label: m.label }));

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
  // the flute can start here where it could never start on load. Once only: a
  // second open would otherwise undo someone who had deliberately muted it.
  //
  // Closing stops it again — but only if this panel is what started it. Read
  // through getState rather than subscribing: Krishna needs to know whether the
  // flute is already playing at the moment of the gesture, and subscribing would
  // re-render the whole conversation every time the header button is pressed.
  // Somebody who turned the flute on from the header owns it, and closing a
  // chat panel is not a request to silence music they chose.
  const offered = useRef(false);
  const startedFlute = useRef(false);
  useEffect(() => {
    if (open) {
      if (offered.current) return;
      offered.current = true;
      if (useApp.getState().flute) return;
      startedFlute.current = true;
      setFlute(true);
    } else if (startedFlute.current) {
      startedFlute.current = false;
      setFlute(false);
    }
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
      <div className="fixed right-4 bottom-4 z-50 flex max-w-[min(80vw,16rem)] flex-col items-end gap-2.5">
        {/* The only part of the product that speaks before it is spoken to. */}
        <KrishnaThought />

        {/* Collapsed to the disc until you go near it: the name is a label for
            a face you can already see, so it only earns its width on hover.
            The grid column animates 0fr to 1fr, which is the one way to give
            "auto" a transition. */}
        <Button
          variant="pop"
          data-glow
          className="group/krishna h-12 shrink-0 gap-0 rounded-full p-2 shadow-lg transition-[padding-right,gap] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:gap-2 hover:pr-5 focus-visible:gap-2 focus-visible:pr-5"
          onClick={() => setOpen(true)}
          aria-label={t("krishnaOpen")}
        >
          <Avatar className="size-8" />
          <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/krishna:grid-cols-[1fr] group-focus-visible/krishna:grid-cols-[1fr]">
            <span
              aria-hidden
              className="overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/krishna:opacity-100 group-hover/krishna:delay-200 group-focus-visible/krishna:opacity-100 group-focus-visible/krishna:delay-200"
            >
              {t("krishna")}
            </span>
          </span>
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

      {/* Glass, so the page's own field carries on behind the panel instead of
          stopping dead at its edge. What was here before was a sky photograph at
          7% opacity under a card-to-card gradient — two layers that cancelled to
          nothing on an opaque slab. Every page that shows this panel already has
          a moving background; that is the thing worth seeing through.

          No `shadow-*` or `border-*` utility here: `.liquid-glass` is unlayered,
          so it wins over anything in @layer utilities and the override would
          silently do nothing. It brings its own rim and shadow. */}
      <aside
        data-krishna-panel
        className={cn(
          "liquid-glass fixed z-50 flex flex-col overflow-hidden",
          // phone: a bottom sheet
          "inset-x-0 bottom-0 max-h-[80dvh] rounded-t-2xl",
          // tablet: a sheet down the right edge, still over the page
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-[min(380px,86vw)] sm:rounded-none",
          // only from xl is there room to dock and let the page keep its layout
          "xl:w-[min(30vw,480px)]"
        )}
        aria-label={t("krishna")}
      >
        <header className="border-border/60 relative flex items-start gap-3 border-b px-4 py-3">
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

        {/* justify-end while the conversation is empty. Pinned to the top, the
            greeting and three prompts left most of a 900px column blank, which
            read as a panel that had failed to load rather than one waiting for a
            question. Once there are turns it goes back to normal flow, because a
            conversation reads downward. */}
        <div
          ref={scroller}
          className={cn(
            "relative flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4",
            turns.length === 0 && !busy && "justify-end"
          )}
        >
          {turns.length === 0 && (
            <div className="flex flex-col gap-3">
              {/* The opening line names this screen, so the first thing a citizen
                reads is proof the panel is looking at the same page they are. */}
              <div className="bg-card border-border/50 flex gap-2.5 rounded-2xl rounded-bl-md border px-3.5 py-3">
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
                  <Item
                    key={a.en}
                    variant="outline"
                    size="xs"
                    render={<button type="button" onClick={() => send(a[locale])} />}
                    className="bg-card/70 hover:border-pop/50 hover:bg-pop/[0.06] group/ask cursor-pointer text-left text-[13px]"
                  >
                    <ItemContent className="gap-0">{a[locale]}</ItemContent>
                    <ItemMedia variant="icon">
                      <ArrowUpRight
                        aria-hidden
                        className="text-muted-foreground/50 group-hover/ask:text-pop size-3.5 transition-transform group-hover/ask:translate-x-0.5 group-hover/ask:-translate-y-0.5"
                      />
                    </ItemMedia>
                  </Item>
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
                  // Opaque on purpose. The shell is glass; the words are not.
                  turn.role === "user"
                    ? "bg-pop text-pop-foreground rounded-br-md"
                    : "bg-card border-border/50 rounded-bl-md border"
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
              <div className="bg-card border-border/50 flex gap-1 rounded-2xl rounded-bl-md border px-3.5 py-3">
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
          className="border-border/60 relative border-t p-2.5"
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

          {/* Was a bare <select>: the one native control left in a designed
              panel, and on a glass ground it rendered as an opaque grey box.
              Which model answered is a footnote, so it stays a footnote — a
              borderless trigger that only looks like a control on hover. */}
          <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 px-1 text-[10px]">
            <span className="shrink-0">{t("modelLabel")}</span>
            <Select items={MODEL_ITEMS} value={model} onValueChange={(v) => setModel(String(v))}>
              <SelectTrigger
                size="sm"
                aria-label={t("chooseModel")}
                className="hover:bg-muted/60 h-6 min-w-0 flex-1 border-transparent px-1.5 text-[10px] dark:bg-transparent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
