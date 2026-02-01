import type { Metadata } from "next";
import Container from "@/components/Container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Förstudie & Blueprint",
  description: "Detaljerad kartläggning och teknisk lösningsdesign innan implementation.",
};

export default function AuditPage() {
  return (
    <main className="pt-32 pb-20">
      <Container>
        <div className="flex flex-col items-center text-center min-h-[60vh]">
          <h1 className="text-hero text-5xl md:text-7xl text-[var(--color-text)] mb-6">
            Förstudie & Blueprint
          </h1>
          <p className="text-xl text-[var(--color-text-body)] max-w-2xl leading-[1.6] mb-8">
            Detaljer kommer inom kort. Vill du starta direkt? Boka ett intro.
          </p>
          <div className="flex gap-4">
            <Button variant="primary" href="/contact">
              Boka förstudie
            </Button>
            <Button variant="secondary" href="/services">
              ← Tillbaka till tjänster
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
