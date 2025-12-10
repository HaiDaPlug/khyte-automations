// Main one-page marketing layout for khyteautomations.com
import Link from "next/link";

function Header() {
  // Simple top navigation with anchor links
  return (
    <header className="sticky top-0 z-20 border-b border-borderSoft/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accentSoft text-sm font-semibold text-accent">
            KA
          </div>
          <span className="text-sm font-medium text-foreground/80">
            Khyte Automations
          </span>
        </div>
        <nav className="hidden gap-6 text-sm text-muted sm:flex">
          <a href="#services" className="hover:text-foreground transition-colors">
            Tjänster
          </a>
          <a href="#process" className="hover:text-foreground transition-colors">
            Så jobbar jag
          </a>
          <a href="#cases" className="hover:text-foreground transition-colors">
            Exempel
          </a>
          <a href="#about" className="hover:text-foreground transition-colors">
            Om mig
          </a>
          <a
            href="#contact"
            className="rounded-full border border-borderSoft px-3 py-1.5 text-foreground hover:border-accent hover:bg-accentSoft transition-colors"
          >
            Kontakt
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  // Hero section with main value prop & CTA
  return (
    <section
      id="top"
      className="section border-b border-borderSoft/60 bg-gradient-to-b from-background/40 to-background"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-0 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-borderSoft bg-background/60 px-3 py-1 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI-workflows & automationer för små och medelstora företag
          </p>

          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            AI som tar hand om jobbet du egentligen inte vill göra.
          </h1>

          <p className="max-w-xl text-sm text-muted sm:text-base">
            Jag hjälper företag att hitta tids­tjuvar i vardagen och bygger
            enkla automationer som sparar tid – utan AI-hype och krångligt
            snack. Fokus: mindre friktion, mer tid till det som faktiskt spelar
            roll.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-slate-900 shadow-soft hover:bg-accent/90 transition-colors"
            >
              Boka ett kort samtal
            </a>
            <a
              href="#services"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Se vad jag kan hjälpa till med →
            </a>
          </div>

          <div className="mt-4 grid gap-4 text-xs text-muted sm:grid-cols-3">
            <div className="rounded-2xl border border-borderSoft bg-background/40 p-3">
              <p className="font-medium text-foreground/90">
                Byråer & konsulter
              </p>
              <p className="mt-1">
                Mindre tid på manuellt pill – mer tid på kreativt och strategi.
              </p>
            </div>
            <div className="rounded-2xl border border-borderSoft bg-background/40 p-3">
              <p className="font-medium text-foreground/90">
                Sälj & prospektering
              </p>
              <p className="mt-1">
                Automatiserade listor och research istället för excel-maraton.
              </p>
            </div>
            <div className="rounded-2xl border border-borderSoft bg-background/40 p-3">
              <p className="font-medium text-foreground/90">
                Admin & backoffice
              </p>
              <p className="mt-1">
                Små automationer som flyttar data, påminner och minskar fel.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="rounded-2xl border border-borderSoft bg-background/80 p-4 shadow-soft">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
              Kort sammanfattning
            </p>
            <h2 className="mt-3 text-sm font-semibold text-foreground">
              Jag sitter bredvid dig, tittar på hur du jobbar – och bygger
              automationer som faktiskt funkar i din vardag.
            </h2>
            <p className="mt-3 text-xs text-muted">
              Ingen flummig "AI-transformation". Vi börjar i era verkliga
              arbetsflöden, hittar tidstjuvarna och tar bort friktionen steg
              för steg.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  // "Vem jag hjälper" + problem space
  return (
    <section id="services" className="section bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        <h2 className="text-xl font-semibold tracking-tight">
          Vem jag hjälper – och vilka problem jag löser
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Jag jobbar främst med mindre och medelstora företag som:
        </p>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-borderSoft bg-background/60 p-4">
            <p className="font-medium text-foreground/90">
              Marknadsförings- & webbyråer
            </p>
            <p className="mt-2 text-xs text-muted">
              Automatiserad research, rapporter och underlag så teamet kan lägga
              mer tid på strategi och kreativt arbete.
            </p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-background/60 p-4">
            <p className="font-medium text-foreground/90">
              Konsulter & frilansare
            </p>
            <p className="mt-2 text-xs text-muted">
              Mindre administrations­tid, smartare mallar och flöden som hjälper
              dig att skala utan att bränna ut dig.
            </p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-background/60 p-4">
            <p className="font-medium text-foreground/90">
              Företag med mycket excel & listor
            </p>
            <p className="mt-2 text-xs text-muted">
              Prospektering, rapportering och uppföljning där mycket kan
              automatiseras – ofta med enkla byggklossar.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-borderSoft bg-background/60 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground/90">
            Tidstjuvar jag letar efter
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• onödigt manuella moment</li>
            <li>• processer som "bara blivit så"</li>
            <li>• arbete som ingen egentligen vill göra</li>
          </ul>
          <p className="mt-3 text-xs text-muted">
            Automations­möjligheterna ligger sällan i en stor "magisk process" –
            utan i det du gör en vanlig onsdag.
          </p>
        </div>
      </div>
    </section>
  );
}

function Process() {
  // Simple 3-step process
  return (
    <section id="process" className="section bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        <h2 className="text-xl font-semibold tracking-tight">
          Så jobbar jag – i tre steg
        </h2>
        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-borderSoft bg-background/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Steg 1
            </p>
            <p className="mt-2 font-medium text-foreground/90">
              Förstår hur ni jobbar idag
            </p>
            <p className="mt-2 text-xs text-muted">
              Vi går igenom ert nuvarande arbetsflöde och pekar ut de största
              tidstjuvarna – utan att krångla till det.
            </p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-background/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Steg 2
            </p>
            <p className="mt-2 font-medium text-foreground/90">
              Skissar lösning & testar i liten skala
            </p>
            <p className="mt-2 text-xs text-muted">
              Jag föreslår en eller flera automationer och bygger en enkel
              prototyp som vi kan känna på tillsammans.
            </p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-background/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Steg 3
            </p>
            <p className="mt-2 font-medium text-foreground/90">
              Bygger klart & anpassar till vardagen
            </p>
            <p className="mt-2 text-xs text-muted">
              När det känns rätt implementerar vi skarpt och justerar tills
              flödena sitter naturligt i ert arbete.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cases() {
  return (
    <section id="cases" className="section bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        <h2 className="text-xl font-semibold tracking-tight">Exempel på jobb</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Några exempel på vad jag byggt eller bygger just nu. Syftet här är att
          ge en känsla – detaljer kan vi ta i ett samtal.
        </p>
        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-borderSoft bg-background/60 p-4">
            <p className="font-medium text-foreground/90">
              Prospektmotor för sälj
            </p>
            <p className="mt-2 text-xs text-muted">
              Hämtar och rensar företagsdata automatiskt till Google Sheets, så
              säljteamet slipper manuellt listbygge.
            </p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-background/60 p-4">
            <p className="font-medium text-foreground/90">
              Research-motor för byrå
            </p>
            <p className="mt-2 text-xs text-muted">
              Samlar in grunddata om kunders branscher och konkurrenter så
              byrån kan lägga mer tid på strategi.
            </p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-background/60 p-4">
            <p className="font-medium text-foreground/90">
              Interna admin-flöden
            </p>
            <p className="mt-2 text-xs text-muted">
              Små automationer som flyttar data mellan verktyg, skickar rätt
              påminnelser och minskar handpåläggning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  // Simple "Om mig" block
  return (
    <section id="about" className="section bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        <h2 className="text-xl font-semibold tracking-tight">Om mig</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
          <div className="space-y-3 text-sm text-muted">
            <p>
              Hej, jag heter Hai och driver{" "}
              <span className="text-foreground/90 font-medium">
                Khyte Automations
              </span>
              .
            </p>
            <p>
              Jag hjälper företag att spara tid genom smarta automationer. Jag är
              inte ännu en "AI-guru" – mer den lugna personen som sätter sig
              bredvid dig, tittar på hur du jobbar och bygger något som faktiskt
              funkar i din vardag.
            </p>
            <p>
              Mitt fokus är att ta bort friktion: mindre manuellt arbete,
              färre onödiga moment, mer tid till det du faktiskt vill lägga
              energi på.
            </p>
          </div>
          <div className="rounded-2xl border border-borderSoft bg-background/70 p-4 text-xs text-muted">
            <p className="font-semibold text-foreground/90">
              Vad du kan förvänta dig
            </p>
            <ul className="mt-2 space-y-1.5">
              <li>• lugn, rak kommunikation</li>
              <li>• fokus på ert verkliga arbetssätt, inte buzzwords</li>
              <li>• små, konkreta steg istället för stora löften</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const email = "hai@khyteteam.com";
  const calendlyLink = "https://calendly.com/hai-khyteteam/30min";
  const formEndpoint = "https://formspree.io/f/xzznjaly";

  return (
    <section id="contact" className="section bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0">
        <h2 className="text-xl font-semibold tracking-tight">
          Nyfiken på vad automation kan göra hos er?
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Lämna dina uppgifter så återkommer jag, eller boka ett kort digitalt
          möte direkt. Ingen hård pitch – vi börjar med att titta på hur ni
          jobbar idag.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Kontaktformulär - FUNCTIONAL with Formspree */}
          <form
            action={formEndpoint}
            method="POST"
            className="space-y-3 rounded-2xl border border-borderSoft bg-background/70 p-4 text-sm"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs text-muted">
                Namn
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Ditt namn"
                required
                className="rounded-xl border border-borderSoft bg-background/60 px-3 py-2 text-sm text-foreground outline-none ring-accent/40 focus:ring"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="company" className="text-xs text-muted">
                Företag
              </label>
              <input
                id="company"
                type="text"
                name="company"
                placeholder="Företagsnamn"
                className="rounded-xl border border-borderSoft bg-background/60 px-3 py-2 text-sm text-foreground outline-none ring-accent/40 focus:ring"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs text-muted">
                E-post
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="din@mejl.se"
                required
                className="rounded-xl border border-borderSoft bg-background/60 px-3 py-2 text-sm text-foreground outline-none ring-accent/40 focus:ring"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-xs text-muted">
                Kort om ert läge / vad du vill prata om
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="T.ex. 'Vi lägger mycket tid på manuella listor, vill se vad som går att förenkla.'"
                required
                className="rounded-xl border border-borderSoft bg-background/60 px-3 py-2 text-sm text-foreground outline-none ring-accent/40 focus:ring"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-accent px-4 py-2 text-sm font-medium text-slate-900 hover:bg-accent/90 transition-colors"
            >
              Skicka förfrågan
            </button>
          </form>

          <div className="space-y-3 rounded-2xl border border-borderSoft bg-background/70 p-4 text-sm text-muted">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              Direktkontakt
            </p>
            <p>
              Maila mig på{" "}
              <a
                href={`mailto:${email}`}
                className="text-accent hover:underline"
              >
                {email}
              </a>{" "}
              eller boka ett kort samtal:
            </p>
            <Link
              href={calendlyLink}
              className="inline-flex items-center justify-center rounded-full border border-borderSoft bg-background/80 px-4 py-2 text-sm font-medium text-foreground hover:border-accent hover:bg-accentSoft transition-colors"
            >
              Boka 20 min digitalt möte
            </Link>
            <p className="text-[11px] text-muted">
              Vi går igenom ert nuläge, jag visar vad jag ser för möjligheter –
              och du avgör om det är värt att gå vidare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  // Simple footer
  return (
    <footer className="border-t border-borderSoft/60 bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-0">
        <p>
          © {new Date().getFullYear()} Khyte Automations. Alla rättigheter
          förbehålls.
        </p>
        <p className="text-[11px]">
          Byggd med Next.js & Tailwind. Ingen AI-hype – bara verkliga flöden.
        </p>
      </div>
    </footer>
  );
}

export default function AutomationsPage() {
  // Page composition
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Cases />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
