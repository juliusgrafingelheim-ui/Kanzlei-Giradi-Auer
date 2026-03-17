import { Helmet } from "react-helmet-async";
import { Award, Users, Target, TrendingUp, Mail } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Placeholder images - werden später durch Storyblok CMS Bilder ersetzt
const imgThomas = "";
const imgBernd = "";
const imgAnna = "";
const imgConstanze = "";
const imgMonika = "";
const imgOffice1 = "";
const imgOffice2 = "";

const team = [
  {
    name: "Dr. Thomas Girardi",
    title: "Rechtsanwalt",
    image: imgThomas,
    description:
      "Dr. Thomas Girardi ist seit 1988 als Rechtsanwalt eingetragen. Dr. Thomas Girardi ist auf Wirtschaftsrecht mit Schwerpunkt Immobilien-, Vertrags-, Bau-, Miet- und Erbrecht spezialisiert.",
    since: "Seit 1989",
    specializations: [
      "Wirtschaftsrecht",
      "Immobilienrecht",
      "Vertragsrecht",
      "Baurecht",
      "Miet- und Erbrecht",
    ],
  },
  {
    name: "Bernd Auer",
    title: "Rechtsanwalt · DI (FH) Mag.",
    image: imgBernd,
    description:
      "Mag. Bernd Auer ist seit 2010 selbständiger Rechtsanwalt und Regiepartner der Kanzleigemeinschaft \"Girardi-Auer\". Seine Fachgebiete sind insbesondere Ehe-, Scheidungs-, Unterhalts-, Kontakt- und Obsorgrecht, Schadenersatz- und Gewährleistungsrecht, Versicherungsrecht, Erbrecht und Vertragsrecht.",
    since: "Seit 2010",
    specializations: [
      "Ehe-, Scheidungs-, Unterhalts-, Kontakt- und Obsorgrecht",
      "Schadenersatz- und Gewährleistungsrecht",
      "Versicherungsrecht",
      "Erbrecht",
      "Vertragsrecht",
    ],
  },
  {
    name: "Anna Girardi",
    title: "Rechtsanwältin · Mag.",
    image: imgAnna,
    description:
      "Frau Mag. Anna Girardi hat sich nach ihrer Ausbildung in der Kanzlei Girardi & Auer im April 2025 als selbstständige Rechtsanwältin eintragen lassen und ist nunmehr Regiepartnerin der Kanzleigemeinschaft \"Girardi-Auer\". Ihre Fachgebiete sind insbesondere Ehe-, Scheidungs-, Unterhalts-, Kontakt- und Obsorgrecht sowie Mietrecht. Zudem ist sie ausgebildete Mediatorin, Konflikt-Coach und systemischer Coach und bietet somit professionelle Unterstützung, um Konflikte effektiv zu lösen.",
    since: "Seit 2025",
    specializations: [
      "Ehe-, Scheidungs-, Unterhalts-, Kontakt- und Obsorgrecht",
      "Mietrecht",
      "Mediation",
      "Konflikt-Coaching",
      "Systemisches Coaching",
    ],
  },
  {
    name: "Constanze Girardi",
    title: "Rechtsanwaltsanwärterin · Mag., B.A.",
    image: imgConstanze,
    description:
      "Constanze Girardi ist als Rechtsanwaltsanwärterin Teil unseres Teams und unterstützt die Kanzlei in allen rechtlichen Belangen.",
    since: "Team",
    specializations: [],
  },
  {
    name: "Monika Girardi",
    title: "Kanzleiassistenz",
    image: imgMonika,
    description: "Monika Girardi ist seit 1989 als Kanzleiassistenz tätig und die erste Ansprechpartnerin für unsere Klienten.",
    since: "Seit 1989",
    specializations: [],
  },
];

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Über uns - Erfahrene Rechtsanwälte seit 1989 | Girardi & Auer</title>
        <meta
          name="description"
          content="Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Dr. Thomas Girardi, Mag. Bernd Auer & Mag. Anna Girardi – Ihre Rechtsanwälte in Innsbruck seit 1989."
        />
        <meta name="keywords" content="Rechtsanwalt Team Innsbruck, Dr. Thomas Girardi, Bernd Auer, Anna Girardi, Anwalt Tirol" />
        <link rel="canonical" href="https://www.girardi-auer.com/ueber-uns" />
        <meta property="og:title" content="Über uns | Rechtsanwaltskanzlei Girardi & Auer" />
        <meta property="og:description" content="Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Erfahrene Rechtsanwälte in Innsbruck seit 1989." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.girardi-auer.com/ueber-uns" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
                <Award className="w-4 h-4 text-slate-700" />
                <span className="text-sm font-medium text-slate-700">Über uns</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Tradition trifft Moderne
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Seit 1989 stehen wir für kompetente Rechtsberatung mit persönlicher Note. 
                Erfahren Sie mehr über unsere Geschichte, Werte und unser Team.
              </p>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-[#1a365d] mb-1">1989</div>
                  <div className="text-sm text-slate-600">Gegründet</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1a365d] mb-1">35+</div>
                  <div className="text-sm text-slate-600">Jahre</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1a365d] mb-1">5</div>
                  <div className="text-sm text-slate-600">Team-Member</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={imgOffice1}
                alt="Kanzlei Büro mit Bibliothek"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Geschichte */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
              Unsere Geschichte
            </h2>

            <div className="space-y-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#0f2744] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">1989</span>
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Die Gründung</h3>
                  <p className="text-slate-600 leading-relaxed">
                    RA Dr. Thomas Girardi hat nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei im Jahre 1989 in Innsbruck gegründet.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2010</span>
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Erster Regiepartner</h3>
                  <p className="text-slate-600 leading-relaxed">
                    RA DI (FH) Mag. Bernd Auer ist nach seiner Ausbildung bei RA Dr. Thomas Girardi in die Kanzlei als Regiepartner eingetreten.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">2025</span>
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Die nächste Generation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    RA Mag. Anna Girardi ist nach ihrer Ausbildung in der Kanzlei Girardi & Auer ebenfalls als Regiepartnerin eingetreten.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-lg text-slate-900 font-medium text-center">
                Besonderen Wert legt die Kanzlei auf eine allumfassende Rechtsberatung 
                und den persönlichen Kontakt zu ihren Klienten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unsere Werte */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Unsere Werte
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Was uns auszeichnet und antreibt
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expertise</h3>
              <p className="text-slate-300 leading-relaxed">
                Die Rechtsanwaltskanzlei „Girardi & Auer" betreut klein- und mittelständische Unternehmen sowie Privatpersonen in allen Belangen des Wirtschafts- und Zivilrechts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Qualität</h3>
              <p className="text-slate-300 leading-relaxed">
                Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, auch komplexe rechtliche Sachverhalte kompetent und zuverlässig zu bearbeiten.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Persönlich</h3>
              <p className="text-slate-300 leading-relaxed">
                Zuverlässig, sachlich und souverän – unsere Mandanten und ihre Fälle erhalten stets die volle persönliche Aufmerksamkeit unseres Teams.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Maßgeschneidert</h3>
              <p className="text-slate-300 leading-relaxed">
                Wir setzen auf eine enge Zusammenarbeit mit unseren Mandanten und entwickeln gemeinsam maßgeschneiderte Lösungen für jede individuelle Situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unser Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Unser Team
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Lernen Sie die Menschen kennen, die sich mit Leidenschaft und Expertise für Ihre rechtlichen Anliegen einsetzen.
            </p>
          </div>

          <div className="space-y-24">
            {team.map((member, index) => (
              <div
                key={member.name}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative">
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-6 bg-[#1a365d] text-white px-6 py-3 rounded-xl shadow-lg">
                      <div className="text-sm font-medium">{member.since}</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-lg text-[#1a365d] font-medium">
                      {member.title}
                    </p>
                  </div>

                  <p className="text-lg text-slate-600 leading-relaxed">
                    {member.description}
                  </p>

                  {member.specializations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">
                        Schwerpunkte
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-4 py-2 bg-slate-50 text-slate-700 text-sm rounded-lg border border-slate-200"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href="mailto:info@girardi-auer.com"
                    className="inline-flex items-center gap-2 text-[#1a365d] hover:text-[#152d4d] font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    Kontakt aufnehmen
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Zusammenarbeit & Sekretariat */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Gemeinsam stark für Sie
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Unser Team arbeitet Hand in Hand, um Ihnen die bestmögliche rechtliche Beratung und Vertretung zu bieten. 
              Durch regelmäßigen Austausch und Zusammenarbeit können wir auf ein breites Spektrum an Expertise zurückgreifen 
              und so auch komplexe Fälle optimal betreuen.
            </p>
          </div>

          {/* Sekretariat */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Sekretariat
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-5 py-3 bg-white text-slate-700 rounded-lg border border-slate-200 shadow-sm">
                Doris Blahut
              </span>
              <span className="px-5 py-3 bg-white text-slate-700 rounded-lg border border-slate-200 shadow-sm">
                Iva Federfová
              </span>
              <span className="px-5 py-3 bg-white text-slate-700 rounded-lg border border-slate-200 shadow-sm">
                Carina Schuler
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Standort Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Unser Standort in Innsbruck
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Unsere Kanzlei befindet sich im Herzen von Innsbruck, in der Stainerstraße 2. 
              Die zentrale Lage ermöglicht eine gute Erreichbarkeit sowohl für Klienten aus Innsbruck 
              als auch aus dem gesamten Tiroler Raum und Bayern.
            </p>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2711.9479489489385!2d11.398097776934576!3d47.26824297116366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479d6c0e0e0e0e0e%3A0x0!2sStainerstra%C3%9Fe%202%2C%206020%20Innsbruck!5e0!3m2!1sde!2sat!4v1234567890123!5m2!1sde!2sat"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kanzlei Girardi & Auer Standort Innsbruck"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}