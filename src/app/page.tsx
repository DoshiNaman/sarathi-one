"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, NotAffiliated } from "@/components/landing/primitives";
import { EightToOne } from "@/components/landing/eight-to-one";
import { PrismHero } from "@/components/landing/prism-hero";
import { Reveal } from "@/components/reveal";
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
      <section data-hero data-ground className="flex min-h-[76dvh] items-center">
        <Container>
          <Reveal className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,440px)] lg:gap-14">
            <div>
              <div data-reveal>
                <Eyebrow>{t("appName")}</Eyebrow>
              </div>
              <h1
                data-reveal
                className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] text-balance"
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
              <div data-reveal className="mt-10">
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
              <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-balance">
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
    </div>
  );
}
