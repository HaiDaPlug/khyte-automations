import Nav from "@/components/Nav";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-0 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Kontakt
          </h1>
          <p className="text-xl text-muted">
            Låt oss prata om din automation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formspree Form */}
          <div>
            <form
              action="https://formspree.io/f/xzznjaly"
              method="POST"
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-muted mb-2">
                  Namn *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-background border border-borderSoft rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-xs font-medium text-muted mb-2">
                  Företag
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full px-4 py-3 bg-background border border-borderSoft rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-muted mb-2">
                  E-post *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-background border border-borderSoft rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-muted mb-2">
                  Meddelande *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-borderSoft rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-accent text-background font-medium rounded-xl hover:bg-accent/90 transition-colors"
              >
                Skicka förfrågan
              </button>
            </form>
          </div>

          {/* Direct Contact Options */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Andra sätt att nå mig
              </h2>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-muted mb-2">E-post</p>
                  <a
                    href="mailto:hai@khyteteam.com"
                    className="text-lg text-accent hover:underline"
                  >
                    hai@khyteteam.com
                  </a>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted mb-3">Boka möte</p>
                  <a
                    href="https://calendly.com/hai-khyteteam/30min"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-8 py-3 border border-borderSoft text-foreground font-medium rounded-xl hover:border-accent hover:text-accent transition-colors"
                  >
                    Boka 30 min
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-borderSoft">
              <p className="text-sm text-muted leading-relaxed">
                Jag svarar vanligtvis inom 24 timmar. Berätta gärna lite om
                vilka processer eller arbetsflöden du vill automatisera, så kan
                vi se om det är en bra match.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
