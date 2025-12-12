import Link from "next/link";
import Nav from "@/components/Nav";

export default function Cases() {
  return (
    <div className="min-h-screen">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Case
          </h1>
          <p className="text-xl text-muted">
            Exempel på automationer jag byggt
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Case 1 */}
          <div className="p-6 border border-borderSoft rounded-2xl bg-background/50">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Prospektmotor för sälj
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-accent font-medium mb-1">Problem</p>
                <p className="text-muted">Manuell datainsamling tar för lång tid</p>
              </div>
              <div>
                <p className="text-accent font-medium mb-1">Build</p>
                <p className="text-muted">Automatisk hämtning av företagsdata till Google Sheets</p>
              </div>
              <div>
                <p className="text-accent font-medium mb-1">Result</p>
                <p className="text-muted">Säljteam får färdiga listor utan manuellt arbete</p>
              </div>
            </div>
          </div>

          {/* Case 2 */}
          <div className="p-6 border border-borderSoft rounded-2xl bg-background/50">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Research-motor för byrå
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-accent font-medium mb-1">Problem</p>
                <p className="text-muted">Research om kunder tar timmar av arbetsveckan</p>
              </div>
              <div>
                <p className="text-accent font-medium mb-1">Build</p>
                <p className="text-muted">Automatisk insamling av bransch- och konkurrentdata</p>
              </div>
              <div>
                <p className="text-accent font-medium mb-1">Result</p>
                <p className="text-muted">Byrån kan fokusera på strategi istället för datainsamling</p>
              </div>
            </div>
          </div>

          {/* Case 3 */}
          <div className="p-6 border border-borderSoft rounded-2xl bg-background/50">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Interna admin-flöden
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-accent font-medium mb-1">Problem</p>
                <p className="text-muted">Manuell datahantering mellan verktyg</p>
              </div>
              <div>
                <p className="text-accent font-medium mb-1">Build</p>
                <p className="text-muted">Automatiserade flöden för påminnelser och dataförflyttning</p>
              </div>
              <div>
                <p className="text-accent font-medium mb-1">Result</p>
                <p className="text-muted">Mindre manuellt arbete, färre fel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-lg text-muted mb-6">
            Vill du ha en liknande lösning?
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-colors"
          >
            Kontakta mig
          </Link>
        </div>
      </main>
    </div>
  );
}
