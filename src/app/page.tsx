import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, NotAffiliated } from "@/components/landing/primitives";
import { EightToOne } from "@/components/landing/eight-to-one";
import { PrismHero } from "@/components/landing/prism-hero";
import { Reveal } from "@/components/reveal";

export default function HomePage() {
  return (
    <div className="pb-12">
      <section data-hero className="flex min-h-[76dvh] items-center">
        <Container>
          <Reveal className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,440px)] lg:gap-14">
            <div>
              <div data-reveal>
                <Eyebrow>Sarathi One</Eyebrow>
              </div>
              <h1
                data-reveal
                className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.95] text-balance"
              >
                Everything a vehicle needs. In one place.
              </h1>
              <p
                data-reveal
                className="text-muted-foreground mt-7 max-w-xl text-lg leading-relaxed"
              >
                Check a used vehicle before you buy it. Transfer it without touching four portals.
                Keep every document, application and receipt in one account.
              </p>
              <div data-reveal className="mt-9 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  data-glow
                  className="bg-pop text-pop-foreground hover:bg-pop/90"
                  nativeButton={false}
                  render={<Link href="/check" />}
                >
                  Check a vehicle
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
                  What is real, what is mocked
                </Button>
              </div>
              <div data-reveal className="mt-10">
                <NotAffiliated className="max-w-md" />
              </div>
            </div>

            <div data-reveal className="w-full justify-self-center lg:justify-self-start">
              <PrismHero />
            </div>
          </Reveal>
        </Container>
      </section>

      <EightToOne />

      <section className="py-20">
        <Container>
          <Reveal className="grid gap-14 md:grid-cols-2">
            <div data-reveal>
              <Eyebrow>Before you pay</Eyebrow>
              <h2 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] leading-tight text-balance">
                The loan is the thing nobody tells you about.
              </h2>
              <p className="text-muted-foreground mt-5 leading-relaxed">
                The official record says only &ldquo;Hypothecated: YES&rdquo;. It will not tell you
                which bank, or whether Form 35 was ever filed. Until it is, the bank still has a
                claim on the car — and you are the one who paid for it.
              </p>
              <Button
                className="mt-7"
                variant="pop"
                data-glow
                nativeButton={false}
                render={<Link href="/check" />}
              >
                See a Trust Report
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
              style={{ "--spectrum-fill": "var(--card)" } as React.CSSProperties}
              className="rounded-2xl p-7 shadow-xl shadow-black/5 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs">Trust Report · GJ01AB1234</p>
                <span className="bg-warning/12 text-warning border-warning/30 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-[0.12em] uppercase">
                  Caution
                </span>
              </div>
              <p className="mt-4 leading-relaxed">
                Active loan with <strong>HDFC Bank Ltd</strong>. Form 35 was never filed, so the
                bank&apos;s claim is still on the RC. Do not pay the seller in full until it clears.
              </p>
              <dl className="mt-6 space-y-2.5 text-sm">
                {[
                  ["Owners", "2"],
                  ["Pending challans", "₹500"],
                  ["Accident record", "None"],
                  ["Fair price", "₹4.65L – ₹5.10L"],
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
