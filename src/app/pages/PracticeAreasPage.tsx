import { Helmet } from "react-helmet-async";
import { 
  Home, 
  FileCheck, 
  FileText, 
  HeartHandshake, 
  Users, 
  Building, 
  TrendingUp, 
  Search,
  Scale,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Placeholder image - wird später durch Storyblok CMS Bilder ersetzt
const imgBookshelf = "";

const practiceAreas = [
  {
    icon: Home,
    title: "Liegenschaftsrecht",
    description:
      "Insbesondere Baurecht sowie Kauf-, Übergabe-, Bauträger- und Mietverträge",
    color: "from-[#1a365d] to-[#0f2744]",
  },
  {
    icon: FileCheck,
    title: "Vergaberecht",
    description: "Beratung und Vertretung in allen Belangen des Vergaberechts",
    color: "from-slate-700 to-slate-800",
  },
  {
    icon: FileText,
    title: "Schadenersatzrecht",
    description: "sowie Gewährleistungsrecht",
    color: "from-slate-600 to-slate-700",
  },
  {
    icon: HeartHandshake,
    title: "Ehe- und Scheidungsrecht",
    description: "sowie Obsorge, Kontakt- und Unterhaltsrecht",
    color: "from-slate-500 to-slate-600",
  },
  {
    icon: Users,
    title: "Erbrecht",
    description:
      "Vertretung im Verlassenschaftsverfahren und Erstellung von letztwilligen Verfügungen",
    color: "from-slate-700 to-slate-800",
  },
  {
    icon: HeartHandshake,
    title: "Erwachsenenschutz",
    description:
      "Erwachsenenvertretung und Beratung bei Vorsorgevollmachten",
    color: "from-slate-600 to-slate-700",
  },
  {
    icon: Building,
    title: "Unternehmensgründung",
    description:
      "Beratung bei Gründung und Erstellung von Gesellschaftsverträgen",
    color: "from-slate-500 to-slate-600",
  },
  {
    icon: TrendingUp,
    title: "Inkassowesen und Forderungsbetreibung",
    description: "Professionelle Durchsetzung Ihrer Ansprüche",
    color: "from-slate-700 to-slate-800",
  },
  {
    icon: Search,
    title: "Rechtsgutachten",
    description: "Fundierte rechtliche Bewertungen und Einschätzungen",
    color: "from-slate-600 to-slate-700",
  },
];

export function PracticeAreasPage() {
  return (
    <>
      <Helmet>
        <title>Rechtsgebiete - Liegenschaftsrecht, Familienrecht & mehr | Girardi & Auer</title>
        <meta
          name="description"
          content="9 Rechtsgebiete mit Expertise: Liegenschaftsrecht, Baurecht, Familienrecht, Erbrecht, Unternehmensrecht, Schadenersatz & mehr. ✓ Erfahrene Anwälte in Innsbruck"
        />
        <meta name="keywords" content="Liegenschaftsrecht Innsbruck, Familienrecht Tirol, Erbrecht, Baurecht, Unternehmensrecht, Schadenersatzrecht" />
        <link rel="canonical" href="https://www.girardi-auer.com/rechtsgebiete" />
        <meta property="og:title" content="Rechtsgebiete | Girardi & Auer Innsbruck" />
        <meta property="og:description" content="Umfassende Rechtsberatung in 9 Fachgebieten. Von Liegenschaftsrecht bis Familienrecht." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.girardi-auer.com/rechtsgebiete" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
              <Scale className="w-4 h-4 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Unsere Expertise</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Tätigkeitsbereiche
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Die Rechtsanwaltskanzlei „Girardi & Auer" betreut klein- und mittelständische Unternehmen 
              sowie Privatpersonen vor allem in folgenden Rechtsgebieten:
            </p>
          </div>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.title}
                  className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-slate-300 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${area.color} mb-6 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#1a365d] transition-colors">
                      {area.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            Umfassende rechtliche Beratung
          </h2>
          
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, 
              auch komplexe rechtliche Sachverhalte kompetent und zuverlässig zu bearbeiten. 
              Wir vertreten Ihre Interessen sowohl außergerichtlich als auch vor Gericht.
            </p>
            
            <p>
              Sollten Sie Fragen zu einem Rechtsgebiet haben, das hier nicht aufgeführt ist, 
              kontaktieren Sie uns gerne. Wir beraten Sie umfassend oder vermitteln Ihnen 
              bei Bedarf qualifizierte Kollegen aus unserem Netzwerk.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl hover:bg-slate-100 transition-all font-medium shadow-xl"
            >
              Beratungstermin vereinbaren
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us for Legal Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Ihr verlässlicher Partner
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Was Sie von unserer Kanzlei erwarten können
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#0f2744] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Fundierte Expertise
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Profundes rechtliches Fachwissen in allen relevanten Bereichen des Zivil- und Wirtschaftsrechts.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Individuelle Betreuung
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Persönlicher Ansprechpartner und maßgeschneiderte Lösungen für Ihre spezifische Situation.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Engagierte Vertretung
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Leidenschaftlicher Einsatz für Ihre Rechte – außergerichtlich und vor Gericht.
              </p>
            </div>
          </div>

          {/* Bookshelf Image */}
          <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={imgBookshelf}
              alt="Rechtsbücher in der Kanzlei"
              className="w-full h-full object-cover aspect-[21/9]"
            />
          </div>
        </div>
      </section>
    </>
  );
}