"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { findVehicle, FLEET, modelFor, REPORT_FEE } from "@/lib/data";
import type { Vehicle } from "@/lib/types";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ErrorState, Spinner } from "@/components/states";
import { PageShell } from "@/components/page-shell";
import { PriceBand } from "@/components/price-band";
import { TransferGate } from "@/components/interstate-check";
import { UnlockDialog } from "@/components/unlock-dialog";
// Imported directly rather than through next/dynamic: it only touches WebGL
// inside an effect, so it is safe to render on the server, and `ogl` is pulled
// in by this route alone — the route chunk already keeps it off every other
// page. Through `dynamic` the chunk was not being requested until some later
// state change, which left the background missing until you touched the page.
import WavesBg from "@/components/waves-bg";
import { Search, RotateCcw, Lock, Car, X } from "lucide-react";

// Both WebGL bundles are fetched only when this route runs — never on the
// landing page, and never in the shared bundle.
const Car3D = dynamic(() => import("@/components/car-3d"), {
  ssr: false,
  // three.js plus a model is a multi-second fetch on a cold load, and an empty
  // panel for that long reads as broken rather than busy.
  loading: () => <StageLoading />,
});

function StageLoading() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="border-muted-foreground/25 border-t-muted-foreground/70 size-6 animate-spin rounded-full border-2" />
        <span className="text-muted-foreground text-xs">Loading model…</span>
      </div>
    </div>
  );
}

const DEMO_REGS = FLEET.map((v) => v.regNo);

function Stage({
  colour,
  label,
  className,
  modelUrl,
}: {
  colour: string;
  label: string;
  className?: string;
  modelUrl?: string;
}) {
  const t = useT();
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {/* The model is decoration; the record is the content. A browser that
          never runs the WebGL chunk still reads the whole page. */}
      <Car3D colour={colour} label={label} modelUrl={modelUrl} />
      <p className="text-muted-foreground pointer-events-none absolute top-3 right-3 text-[11px]">
        {t("dragToRotate")}
      </p>
      {/* Backed like the drag hint: the canvas is dark at the bottom and the
          card is light, so an unbacked line straddles both and half of it
          drops below readable contrast. */}
      <p className="text-muted-foreground bg-background/70 pointer-events-none absolute bottom-2.5 left-2.5 rounded px-1.5 py-0.5 text-[11px]">
        {t("modelNote")}
      </p>
    </div>
  );
}

/** One line of the record. Muted key, hard value. */
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b py-1.5 text-sm last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

/** A thing the buyer does not get until the seller consents. */
function LockedRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 py-1.5 text-sm">
      <Lock aria-hidden className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}

export default function CheckPage() {
  const t = useT();
  const router = useRouter();
  const { mobile, unlockedReports, unlockReport, addPayment, recentChecks, rememberCheck } =
    useApp();
  const forgetChecks = useApp((s) => s.forgetChecks);
  const setPrefill = useApp((s) => s.setPrefill);
  // Krishna steers people here with the number they asked about. The push
  // happens before this page mounts, so the value is already in the store and
  // belongs in the initial state — setting it from an effect would render the
  // empty field first and then replace it.
  const [regNo, setRegNo] = useState(() => useApp.getState().prefill ?? "");
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);
  // The pay-and-consent flow runs inside its own dialog now, so the card only
  // has to know whether it is open.
  const [unlockOpen, setUnlockOpen] = useState(false);
  // "Can this car even be re-registered where I live?" is asked on the way to
  // the report rather than in a panel below it, where a buyer heading for the
  // button scrolled straight past it.
  const [gateOpen, setGateOpen] = useState(false);
  // The placeholder cycles through the demo numbers, so the field shows both the
  // format and what actually works here. It holds still once someone starts
  // typing, and for anyone who has asked the system for less motion.
  const [hint, setHint] = useState(0);
  const field = useRef<HTMLInputElement>(null);

  // Consumed once, so a later visit does not re-fill a field they cleared.
  useEffect(() => setPrefill(null), [setPrefill]);

  useEffect(() => {
    if (regNo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Slow enough to read one number before it changes. Faster than this and it
    // reads as a flicker rather than an example.
    const id = setInterval(() => setHint((i) => (i + 1) % DEMO_REGS.length), 3400);
    return () => clearInterval(id);
  }, [regNo]);

  // Reads through the API so the citizen sees what the admin panel last saved,
  // falling back to the local synthetic record if the database is unreachable.
  async function search(query = regNo) {
    if (!query.trim() || searching) return;
    // Keep the field and the "Checking …" line naming the same number: a chip
    // passes its own query in, and reading the input state instead left the
    // line saying "Checking" with nothing after it.
    setRegNo(query);
    setUnlockOpen(false);
    setSearching(true);
    setFailed(false);
    setNotFound(false);
    const local = findVehicle(query);
    try {
      const res = await fetch(`/api/vehicles/${encodeURIComponent(query)}`);
      if (res.ok) {
        const d = await res.json();
        setVehicle(d.vehicle);
        rememberCheck(d.vehicle.regNo);
        return;
      }
      // A 404 from the API is authoritative unless we hold a local record.
      setVehicle(local ?? null);
      setNotFound(!local);
      if (local) rememberCheck(local.regNo);
    } catch {
      // Network failure is not "no such vehicle": fall back to the local record,
      // and say so plainly when there is not one.
      setVehicle(local ?? null);
      if (local) rememberCheck(local.regNo);
      else setFailed(true);
    } finally {
      setSearching(false);
    }
  }

  function reset() {
    setVehicle(null);
    setNotFound(false);
    setFailed(false);
    setUnlockOpen(false);
    setRegNo("");
    field.current?.focus();
  }

  function pick(reg: string) {
    setRegNo(reg);
    void search(reg);
  }

  const unlocked = !!vehicle && unlockedReports.includes(vehicle.regNo);
  // Before the first lookup the search is the whole screen. Once there is a
  // result it steps back into a bar, because the record is what they came for.
  const resting = !vehicle && !notFound && !failed && !searching;
  // Nothing to show yet — a first visit, a number in flight, or one that missed.
  // The screen still has one job, so it keeps the one centred column. Without
  // the in-flight case the header sat left while the spinner sat centred.
  const centred = resting || notFound || (searching && !vehicle);

  const searchForm = (
    <form
      // One pill: the plate badge, the number, and the action. A registration
      // number is a single short token, so it reads better as one control than
      // as a field with a button parked beside it.
      className="group relative mx-auto w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        // The action stays solid rather than greying out on an empty field: a
        // dead-looking button reads as broken, and pointing at the field says
        // what to do next.
        if (!regNo.trim()) {
          field.current?.focus();
          return;
        }
        void search();
      }}
    >
      {/* Same glass as the chips below it. A little more opaque than they are —
          they hold four short characters, this holds a number someone is
          reading back to check they typed it right. */}
      <div className="border-border/60 bg-card/65 focus-within:border-pop/50 relative flex items-center gap-2.5 rounded-2xl border p-2 shadow-sm backdrop-blur-xl transition-colors">
        {/* Tinted glass rather than a solid fill, so the badge and the action
            are the same material as the bar they sit in — just coloured. */}
        <span
          aria-hidden
          className="bg-pop/15 text-pop border-pop/30 ml-1 grid size-7 shrink-0 place-items-center rounded-md border backdrop-blur-md"
        >
          <Car className="size-4" />
        </span>
        <Input
          ref={field}
          placeholder={DEMO_REGS[hint]}
          aria-label={t("regNoPlaceholder")}
          value={regNo}
          className="h-9 flex-1 border-0 bg-transparent px-0 font-mono text-base tracking-wider uppercase shadow-none focus-visible:ring-0 sm:text-lg dark:bg-transparent"
          onChange={(e) => setRegNo(e.target.value.toUpperCase())}
        />
        <Button
          type="submit"
          variant="pop"
          // Frosted, not faint. A light tint put the grape label at 4.47:1 on
          // its own background — under the 4.5 minimum — and because the label
          // is the accent colour, more tint made it worse. A heavy tint with
          // the light label goes the other way and keeps the one primary action
          // looking primary.
          className="bg-pop/85 border-pop/50 hover:bg-pop h-10 shrink-0 rounded-md border px-4 backdrop-blur-md"
          data-testid="search"
          disabled={searching}
        >
          {searching ? <Spinner /> : <Search aria-hidden />}
          <span className="hidden sm:inline">{t("checkAction")}</span>
          <span className="sr-only sm:hidden">{t("checkVehicle")}</span>
        </Button>
      </div>
    </form>
  );

  const recent = recentChecks.length > 0 && (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted-foreground inline-flex items-center gap-1">
        <RotateCcw aria-hidden className="size-3" /> {t("recentChecks")}
      </span>
      {recentChecks.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => pick(r)}
          className="border-border/60 bg-card/50 hover:border-pop/50 hover:bg-card/80 rounded-md border px-2.5 py-1 font-mono shadow-sm backdrop-blur-md transition"
        >
          {r}
        </button>
      ))}
      <button
        type="button"
        onClick={forgetChecks}
        className="text-muted-foreground hover:text-foreground underline"
      >
        {t("clearRecent")}
      </button>
    </div>
  );

  // Offered on the first visit and again after a miss, so it is written once.
  const demoPlates = (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">{t("orTryDemo")}</span>
        <span className="bg-border h-px flex-1" />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {DEMO_REGS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => pick(r)}
            // Glass, and meant literally: the wave field is right behind
            // this row, so the blur actually has something to pick up.
            //
            // 44px on touch, 36px once there is a pointer — the minimum
            // target size differs between the two.
            className="border-border/60 bg-card/50 hover:border-pop/50 hover:bg-card/80 focus-visible:ring-ring inline-flex min-h-11 items-center rounded-lg border px-3.5 font-mono text-sm shadow-sm backdrop-blur-md transition duration-200 focus-visible:ring-2 focus-visible:outline-none motion-safe:hover:-translate-y-0.5 sm:min-h-9"
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Behind everything, pinned to the viewport so it does not scroll with
          the record. Decorative and inert — it is fixed, aria-hidden and takes
          no pointer events. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Palettes and their strengths live in the component, one per theme —
            the two grounds need different values, not the same colours dimmed. */}
        <WavesBg />
      </div>
      <PageShell
        title={t("checkVehicle")}
        // With a result on screen the explainer has done its job, and the field
        // moves up beside the title. That reclaims most of a phone's first
        // screen, which is the difference between glancing and scrolling.
        description={vehicle ? undefined : t("checkDesc")}
        action={
          vehicle ? (
            <div className="flex w-full items-center gap-2 sm:w-[30rem]">
              <div className="min-w-0 flex-1">{searchForm}</div>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-11 shrink-0 rounded-2xl p-0"
                onClick={reset}
                title={t("resetSearch")}
              >
                <X aria-hidden className="size-4" />
                <span className="sr-only">{t("resetSearch")}</span>
              </Button>
            </div>
          ) : undefined
        }
        width={centred ? "default" : "full"}
        align={centred ? "center" : "start"}
        dense={!!vehicle}
      >
        <div className="space-y-6">
          {/* First run: one field, centred, and nothing else asking to be read.
            The demo numbers are numbers only. Listing the make, model and city
            beside each one answered the question before it was asked — the
            whole point of this screen is to look something up. */}
          {resting ? (
            <div className="mx-auto max-w-xl space-y-6 pb-16">
              {searchForm}
              {recent}

              <div className="space-y-2.5 pt-2">
                {demoPlates}
                <p className="text-muted-foreground text-center text-xs">
                  {t("syntheticFleetNote")}
                </p>
              </div>
            </div>
          ) : vehicle ? (
            // The field lives in the header row in this state.
            recent
          ) : (
            <div className={centred ? "space-y-3 text-center" : "space-y-3"}>
              <div className={centred ? "mx-auto max-w-xl" : "max-w-xl"}>{searchForm}</div>
              <div className={centred ? "flex justify-center" : undefined}>{recent}</div>
            </div>
          )}

          {/* The button is already spinning, so this only has to say which number
            is in flight. A six-row skeleton promised a shape the result does not
            have, and drew more attention than the wait deserves. */}
          {searching && !vehicle && (
            <p className="text-muted-foreground flex items-center justify-center gap-2 py-10 text-sm">
              <Spinner className="size-3.5" />
              {t("checkingNumber")} <span className="font-mono">{regNo}</span>
            </p>
          )}

          {failed && (
            <ErrorState
              title={t("couldNotReachRecord")}
              description={t("checkConnection")}
              action={
                <Button variant="outline" onClick={() => void search()}>
                  {t("retry")}
                </Button>
              }
            />
          )}

          {notFound && !searching && (
            // Nothing found is not an occasion for a set piece. One line saying
            // what happened, the number that failed, and a way straight back in.
            <div className="mx-auto max-w-xl pt-5 pb-10 text-center">
              <h2 className="font-display mt-3 text-3xl">{t("noVehicle")}</h2>

              <div className="mt-7">{demoPlates}</div>
            </div>
          )}

          {vehicle && (
            <>
              {/* Three columns, one screenful: the record on the left, the car in the
                middle, what it is worth on the right. Nothing here is worth a scroll
                to reach — the whole point is to glance and decide.
                A fixed row on wide screens. Everything that can change size — the
                pay and consent steps, the price card's own accordion — absorbs the
                change inside its card instead of pushing the whole row taller. */}
              <div className="grid gap-4 xl:h-[33rem] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)]">
                <div className="liquid-glass flex min-h-0 flex-col overflow-y-auto rounded-2xl p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-medium">{t("thinBeam")}</h2>
                    <Badge variant="outline">{t("eightFields")}</Badge>
                  </div>
                  <div className="mt-3">
                    <Row k={t("makerModel")} v={`${vehicle.maker} ${vehicle.model}`} />
                    <Row
                      k={t("ownerLabel")}
                      v={vehicle.owners[vehicle.owners.length - 1].maskedName}
                    />
                    <Row k={t("registeringAuthority")} v={vehicle.rto} />
                    <Row
                      k={t("classFuelEmission")}
                      v={`${vehicle.vehicleClass} · ${vehicle.fuel} · ${vehicle.emission}`}
                    />
                    <Row k={t("regDate")} v={vehicle.regDate} />
                    <Row
                      k={t("hypothecatedLabel")}
                      v={vehicle.hypothecation.active ? t("yesLabel") : t("noLabel")}
                    />
                    <Row k={t("insuranceValidTill")} v={vehicle.insurance.validTill} />
                    <Row k={t("pucValidTill")} v={vehicle.puc.validTill} />
                  </div>

                  {/* The argument stays on this card rather than taking a column of
                  its own: what is missing only means something next to what is
                  there. */}
                  <div className="border-border/60 mt-4 border-t pt-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium">{t("fullSpectrum")}</h3>
                      <Badge variant="outline">{t("lockedCount")}</Badge>
                    </div>
                    <ul className="mt-1">
                      <LockedRow text={t("lockedOwners")} />
                      <LockedRow text={t("lockedAccident")} />
                      <LockedRow text={t("lockedChallans")} />
                      <LockedRow text={t("lockedFinancier")} />
                    </ul>
                  </div>
                </div>

                <div className="liquid-glass flex min-h-0 flex-col overflow-hidden rounded-2xl">
                  <Stage
                    colour={vehicle.color}
                    label={`${vehicle.maker} ${vehicle.model}`}
                    modelUrl={modelFor(vehicle.maker, vehicle.model)}
                    // min-h-0 so the stage is what gives way when the unlock steps
                    // open. The car shrinking is a far better trade than the card
                    // growing past the fold.
                    className="min-h-56 flex-1 xl:min-h-40"
                  />
                  {/* The car is what they looked up, so it leads. The plate and the
                  status are how they confirm it is the right one, so they sit
                  directly under the name rather than above it. */}
                  <div className="space-y-3 p-5 pt-3.5">
                    <div className="space-y-1">
                      <p className="font-display truncate text-2xl leading-tight">
                        {vehicle.maker} {vehicle.model}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm tracking-tight">{vehicle.regNo}</span>
                        <Badge variant={vehicle.status === "ACTIVE" ? "secondary" : "destructive"}>
                          {vehicle.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {vehicle.year} · {vehicle.color} · {vehicle.fuel} · {vehicle.rto}
                      </p>
                    </div>

                    {unlocked ? (
                      <Button
                        className="w-full"
                        nativeButton={false}
                        render={<Link href={`/report/${vehicle.regNo}`} />}
                      >
                        {t("openReport")} →
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant="pop"
                        data-testid="unlock"
                        onClick={() => (mobile ? setGateOpen(true) : router.push("/login"))}
                      >
                        {t("unlockReport")} — ₹{REPORT_FEE}
                      </Button>
                    )}
                  </div>
                </div>

                <PriceBand vehicle={vehicle} consented={unlocked} compact />
              </div>

              <TransferGate
                vehicle={vehicle}
                open={gateOpen}
                onOpenChange={setGateOpen}
                confirmLabel={`${t("unlockReport")} — ₹${REPORT_FEE}`}
                onConfirm={() => {
                  setGateOpen(false);
                  setUnlockOpen(true);
                }}
              />

              <UnlockDialog
                vehicle={vehicle}
                open={unlockOpen}
                onOpenChange={setUnlockOpen}
                onComplete={() => {
                  // Charge and unlock together: abandoning the consent step must
                  // never leave a receipt for a report you cannot open.
                  addPayment({
                    purpose: "Trust Report",
                    regNo: vehicle.regNo,
                    amount: REPORT_FEE,
                  });
                  unlockReport(vehicle.regNo);
                  router.push(`/report/${vehicle.regNo}`);
                }}
              />
            </>
          )}
        </div>
      </PageShell>
    </>
  );
}
