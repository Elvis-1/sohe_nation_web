import { Container } from "@/core/ui/container";
import { CheckoutPageShell } from "@/features/cart-and-checkout/presentation/components/checkout-page-shell";

export default function CheckoutPage() {
  return (
    <Container className="py-10 md:py-14">
      <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(26,25,24,0.98),rgba(11,11,11,0.92))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_30%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
          Checkout Handoff
        </p>
        <h1 className="mt-4 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl lg:text-[5.5rem]">
          The final handoff,
          <span className="block text-[var(--color-accent-gold-highlight)]">kept clear and controlled.</span>
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-secondary)]">
          Review the staged order, choose the provider route, and simulate the hosted redirect flow
          before real payment integration lands.
        </p>
      </section>

      <div className="mt-8">
        <CheckoutPageShell />
      </div>
    </Container>
  );
}
