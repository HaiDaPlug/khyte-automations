import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 animate-gradient"></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-float-delayed"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 text-center relative z-10">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            AI som tar hand om jobbet du inte vill göra.
          </h1>
          <p className="text-xl sm:text-2xl text-muted max-w-3xl mx-auto mb-12">
            Jag bygger automationer som tar bort friktion i vardagen — utan hype, bara fungerande workflows.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cases"
              className="px-8 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-colors w-full sm:w-auto"
            >
              Se case
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-borderSoft text-foreground font-medium rounded-xl hover:border-accent hover:text-accent transition-colors w-full sm:w-auto"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </section>

      {/* Case Preview Section */}
      <section className="section max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-24">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Case
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <Link
            href="/cases"
            className="p-6 border border-borderSoft rounded-2xl hover:border-accent transition-colors group"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
              Prospektmotor för sälj
            </h3>
            <p className="text-sm text-muted">
              Automatisk hämtning av företagsdata till färdiga listor.
            </p>
          </Link>

          <Link
            href="/cases"
            className="p-6 border border-borderSoft rounded-2xl hover:border-accent transition-colors group"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
              Research-motor för byrå
            </h3>
            <p className="text-sm text-muted">
              Automatisk insamling av bransch- och konkurrentdata.
            </p>
          </Link>

          <Link
            href="/cases"
            className="p-6 border border-borderSoft rounded-2xl hover:border-accent transition-colors group"
          >
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
              Interna admin-flöden
            </h3>
            <p className="text-sm text-muted">
              Automatiserade flöden för påminnelser och dataförflyttning.
            </p>
          </Link>
        </div>
      </section>

      {/* How I Work Section */}
      <section className="section max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-24 border-t border-borderSoft">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Så jobbar jag
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accentSoft text-accent rounded-xl font-bold text-xl mb-4">
              1
            </div>
            <p className="text-foreground font-medium">
              Kartlägger flödet – vi hittar tidstjuvarna
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accentSoft text-accent rounded-xl font-bold text-xl mb-4">
              2
            </div>
            <p className="text-foreground font-medium">
              Bygger en prototyp – testar snabbt
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accentSoft text-accent rounded-xl font-bold text-xl mb-4">
              3
            </div>
            <p className="text-foreground font-medium">
              Implementerar skarpt – justerar tills det sitter
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTAs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-24">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cases"
            className="px-8 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-colors w-full sm:w-auto text-center"
          >
            Se alla case
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border border-borderSoft text-foreground font-medium rounded-xl hover:border-accent hover:text-accent transition-colors w-full sm:w-auto text-center"
          >
            Kontakta mig
          </Link>
        </div>
      </section>
    </div>
  );
}
