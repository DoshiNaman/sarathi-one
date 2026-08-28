import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, NotAffiliated } from "@/components/landing/primitives";
import { EightToOne } from "@/components/landing/eight-to-one";
import { PrismHero } from "@/components/landing/prism-hero";
import { Reveal } from "@/components/reveal";

export default function HomePage() {
  return (
    <div className="pb-24">
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
                  className="bg-pop text-pop-foreground hover:bg-pop/90"
                  nativeButton={false}
                  render={<Link href="/check" />}
                >
                  Check a vehicle <ArrowRight aria-hidden />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
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

      <section className="py-24">
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
                nativeButton={false}
                render={<Link href="/check" />}
              >
                See a Trust Report <ArrowRight aria-hidden />
              </Button>
            </div>
            <div data-reveal className="bg-card rounded-2xl border p-7">
              <p className="text-muted-foreground text-xs">Trust Report · GJ01AB1234</p>
              <p className="text-warning mt-4 text-sm font-medium">CAUTION</p>
              <p className="mt-1.5 leading-relaxed">
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
                  <div key={k} className="flex justify-between border-b pb-2 last:border-0">
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
