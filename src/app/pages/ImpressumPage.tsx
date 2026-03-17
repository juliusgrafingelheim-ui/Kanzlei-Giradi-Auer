import { Helmet } from "react-helmet-async";
import { Scale } from "lucide-react";

export function ImpressumPage() {
  return (
    <>
      <Helmet>
        <title>Impressum | Rechtsanwaltskanzlei Girardi & Auer Innsbruck</title>
        <meta
          name="description"
          content="Impressum der Rechtsanwaltskanzlei Girardi & Auer, Stainerstraße 2, 6020 Innsbruck. Rechtliche Angaben gemäß österreichischem Recht."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.girardi-auer.com/impressum" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Impressum
            </h1>
            <p className="text-xl text-slate-200">
              GIRARDI & AUER<br />
              Rechtsanwälte in Regiegemeinschaft
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-12">
            {/* Kontaktdaten */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
                <Scale className="w-4 h-4 text-slate-700" />
                <span className="text-sm font-medium text-slate-700">Kontaktdaten</span>
              </div>
              
              <div className="space-y-4 text-lg text-slate-700">
                <p className="font-semibold text-2xl text-slate-900">
                  Stainerstraße 2<br />
                  6020 Innsbruck
                </p>

                <div className="space-y-2">
                  <p>
                    <strong>Tel.:</strong> <a href="tel:+43512574095" className="hover:text-[#1a365d] transition-colors">+43 (0)512 / 57 40 95</a>
                  </p>
                  <p>
                    <strong>Fax:</strong> +43 (0)512 / 57 40 97
                  </p>
                  <p>
                    <strong>Email:</strong> <a href="mailto:info@girardi-auer.com" className="hover:text-[#1a365d] transition-colors underline">info@girardi-auer.com</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-12"></div>

            {/* Rechtsanwälte */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 text-center">
                Rechtsanwälte
              </h2>

              <div className="space-y-6 text-lg text-slate-700">
                <div className="p-6 bg-slate-50 rounded-xl">
                  <p className="font-semibold text-xl text-slate-900 mb-2">
                    RA Dr. Thomas Girardi
                  </p>
                  <p>ADVM-Code: R802574</p>
                  <p>UID: ATU 31367703</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl">
                  <p className="font-semibold text-xl text-slate-900 mb-2">
                    RA DI (FH) Mag. Bernd Auer
                  </p>
                  <p>ADVM-Code: R808398</p>
                </div>

                <div className="p-6 bg-slate-50 rounded-xl">
                  <p className="font-semibold text-xl text-slate-900 mb-2">
                    RA Mag. Anna Girardi
                  </p>
                  <p>ADVM-Code: R818867</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 my-12"></div>

            {/* Berufsrechtliche Angaben */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 text-center">
                Berufsrechtliche Angaben
              </h2>

              <div className="space-y-4 text-slate-700">
                <p>
                  <strong>Berufsbezeichnung:</strong><br />
                  Rechtsanwalt (verliehen in Österreich)
                </p>

                <p>
                  <strong>Kammer:</strong><br />
                  Rechtsanwaltskammer für Tirol<br />
                  Meraner Straße 3, 6020 Innsbruck<br />
                  <a 
                    href="https://www.rechtsanwaelte-tirol.at" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1a365d] hover:underline"
                  >
                    www.rechtsanwaelte-tirol.at
                  </a>
                </p>

                <p>
                  <strong>Berufsrechtliche Vorschriften:</strong><br />
                  Rechtsanwaltsordnung (RAO)<br />
                  Allgemeine Bedingungen für Rechtsanwälte<br />
                  Standesregeln der Rechtsanwälte<br />
                  Disziplinarstatut der Rechtsanwaltskammern
                </p>

                <p className="text-sm">
                  Die berufsrechtlichen Vorschriften können auf der Website der Österreichischen Rechtsanwaltskammer unter{" "}
                  <a 
                    href="https://www.rechtsanwaelte.at" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1a365d] hover:underline"
                  >
                    www.rechtsanwaelte.at
                  </a>{" "}
                  eingesehen werden.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 my-12"></div>

            {/* Haftung für Inhalte */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 text-center">
                Haftungsausschluss
              </h2>

              <div className="space-y-4 text-slate-700">
                <p>
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                </p>

                <p>
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-8">
                  Haftung für Links
                </h3>

                <p>
                  Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Die Rechtsanwälte Girardi & Auer übernehmen keine Verantwortung für Inhalte auf Websites von unseren Partnern und teilnehmenden Firmen, auf die mittels Links verwiesen wird. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 mt-8">
                  Urheberrecht
                </h3>

                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}