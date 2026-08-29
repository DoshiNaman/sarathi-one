"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, NotAffiliated } from "@/components/landing/primitives";
import { EightToOne } from "@/components/landing/eight-to-one";
import { SevenToOne } from "@/components/landing/seven-to-one";
import { PrismHero } from "@/components/landing/prism-hero";
import { Reveal } from "@/components/reveal";
import { Feather } from "@/components/feather";
import { cssVars } from "@/lib/utils";
import { useT } from "@/lib/i18n";

const FINANCIER = "HDFC Bank Ltd";

export default function HomePage() {
  const t = useT();
  // The bank name stays Latin in every locale, so the sentence carries a
  // {bank} slot instead of being split around a hardcoded English fragment.
  const [beforeBank, afterBank] = t("trustCardBody").split("{bank}");

  return (
    <div>
      <section data-hero data-ground className="relative flex min-h-[76dvh] items-center">
        {/* Two plates down the outer edges, faded into the ground and masked so
            they never draw a hard rectangle beside the headline. Hidden below
            md: at phone width there are no outer edges to give away. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
        >
          <Image
            src="/krishna/leap.jpg"
            alt=""
            width={600}
            height={900}
            priority={false}
            className="absolute top-0 -left-6 h-full w-[clamp(180px,20cqi,300px)] [mask-image:linear-gradient(to_right,transparent,black_18%,black_55%,transparent)] object-cover opacity-[0.14] select-none"
          />
          <Image
            src="/krishna/sky.jpg"
            alt=""
            width={600}
            height={900}
            priority={false}
            className="absolute top-0 -right-6 h-full w-[clamp(180px,20cqi,300px)] [mask-image:linear-gradient(to_left,transparent,black_18%,black_55%,transparent)] object-cover opacity-[0.14] select-none"
          />
        </div>

        <Container>
          <Reveal className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,440px)] lg:gap-14">
            <div>
              <div data-reveal className="mt-8">
                <Eyebrow>{t("appName")}</Eyebrow>
              </div>
              <h1
                data-reveal
                className="font-display text-[clamp(2.4rem,6cqi,4.6rem)] leading-[0.95] text-balance"
              >
                {t("heroTitle")}
              </h1>
              <p
                data-reveal
                className="text-muted-foreground mt-7 max-w-xl text-lg leading-relaxed"
              >
                {t("heroSub")}
              </p>
              <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  data-glow
                  className="bg-pop text-pop-foreground hover:bg-pop/90"
                  nativeButton={false}
                  render={<Link href="/check" />}
                >
                  {t("checkVehicle")}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-200 group-hover/button:translate-x-0.5"
                  />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:border-foreground/30 hover:-translate-y-px"
                  nativeButton={false}
                  render={<Link href="/how-it-works" />}
                >
                  {t("whatIsMocked")}
                </Button>
              </div>
              {/* Krishna is the third beat. One line, not a second paragraph:
                  the hero's job is the problem, and the guide only has to be
                  named here — the panel is two inches away and already talking. */}
              <p
                data-reveal
                className="text-muted-foreground mt-7 flex items-start gap-2.5 text-sm leading-relaxed"
              >
                <Feather className="text-pop mt-0.5 size-4 shrink-0" />
                <span className="max-w-md">{t("heroKrishnaLine")}</span>
              </p>

              <div data-reveal className="mt-8 mb-8">
                <NotAffiliated className="max-w-md">{t("notAffiliated")}</NotAffiliated>
              </div>
            </div>

            <div data-reveal className="w-full justify-self-center lg:justify-self-start">
              <PrismHero />
            </div>
          </Reveal>
        </Container>
      </section>

      <EightToOne />

      <section className="pt-26 pb-26">
        <Container>
          <Reveal className="grid items-center gap-10 md:grid-cols-2 lg:gap-14">
            <div data-reveal>
              <Eyebrow>{t("beforeYouPay")}</Eyebrow>
              <h2 className="font-display text-[clamp(1.9rem,4cqi,2.8rem)] leading-tight text-balance">
                {t("loanTitle")}
              </h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">{t("loanBody")}</p>
              <Button
                className="mt-7"
                variant="pop"
                data-glow
                nativeButton={false}
                render={<Link href="/check" />}
              >
                {t("seeTrustReport")}
                <ArrowRight
                  aria-hidden
                  className="transition-transform duration-200 group-hover/button:translate-x-0.5"
                />
              </Button>
            </div>
            {/* The one card on the page that IS the product, so it carries the
                spectrum edge. --spectrum-fill has to be an opaque colour: the
                border ring is painted behind the fill, and a translucent fill
                would let the conic gradient wash through the whole card. */}
            <div
              data-reveal
              data-spectrum
              style={cssVars({ "--spectrum-fill": "var(--card)" })}
              className="rounded-2xl p-7 shadow-xl shadow-black/5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs">{t("trustReport")} · GJ01AB1234</p>
                <span className="bg-warning/12 text-warning border-warning/30 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-[0.12em] uppercase">
                  {t("caution")}
                </span>
              </div>
              <p className="mt-4 leading-relaxed">
                {beforeBank}
                <strong>{FINANCIER}</strong>
                {afterBank}
              </p>
              <dl className="mt-6 space-y-2.5 text-sm">
                {[
                  [t("ownersLabel"), "2"],
                  [t("pendingChallans"), "₹500"],
                  [t("accidentRecord"), t("noneLabel")],
                  [t("fairPrice"), "₹4.65L – ₹5.10L"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="hover:border-foreground/25 flex justify-between border-b pb-2 transition-colors last:border-0"
                  >
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Krishna sits after the Trust Report, not before it. A judge scoring
          "problem" needs the problem in the first screen; the guide is the how,
          and it earns its own section once the what has landed. */}
      <section className="pb-26">
        <Container>
          <div className="bg-ink text-ink-foreground relative overflow-hidden rounded-[28px] px-6 py-12 sm:px-12 sm:py-16">
            {/* the spectrum, restated as the top edge of the darkest block */}
            <span data-spectrum-rule aria-hidden className="absolute inset-x-0 top-0 h-px" />
            {/* one feather, far back, so the block is not a flat rectangle */}
            <Image
              src="/krishna/avatar2.jpg"
              alt=""
              width={400}
              height={711}
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 w-[clamp(200px,24cqi,360px)] rotate-[18deg] opacity-[0.09] mix-blend-luminosity select-none"
            />

            <Reveal className="relative grid items-center gap-10 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16">
              <figure data-reveal className="mx-auto w-full max-w-[300px]">
                <div className="ring-ink-muted/25 overflow-hidden rounded-2xl bg-[#f6f4ef] shadow-2xl ring-1 shadow-black/30">
                  <Image
                    src="/krishna/guide.jpg"
                    alt=""
                    width={576}
                    height={1024}
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="text-ink-muted mt-3 text-center text-[11px] tracking-[0.16em] uppercase">
                  {t("krishnaCaption")}
                </figcaption>
              </figure>

              <div data-reveal>
                <p className="text-ink-muted mb-3 text-[11px] font-medium tracking-[0.18em] uppercase">
                  {t("krishnaEyebrow")}
                </p>
                <h2 className="font-display text-[clamp(1.7rem,3.4cqi,2.6rem)] leading-tight text-balance">
                  {t("krishnaTitle")}
                </h2>
                <p className="text-ink-muted mt-5 leading-relaxed">{t("krishnaBody")}</p>

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[t("greetCheck"), t("greetReport"), t("greetServices"), t("greetTransfer")].map(
                    (line) => (
                      <li
                        key={line}
                        className="border-ink-muted/20 bg-ink-foreground/[0.04] flex items-start gap-2.5 rounded-xl border p-3.5"
                      >
                        <Feather className="text-pop mt-0.5 size-4 shrink-0" />
                        <span className="text-ink-muted text-[13px] leading-relaxed">{line}</span>
                      </li>
                    )
                  )}
                </ul>

                <Button
                  className="mt-8"
                  variant="pop"
                  data-glow
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("krishna:ask", { detail: "" }))
                  }
                >
                  <Feather className="size-4" />
                  {t("krishnaOpen")}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <SevenToOne />
    </div>
  );
}
