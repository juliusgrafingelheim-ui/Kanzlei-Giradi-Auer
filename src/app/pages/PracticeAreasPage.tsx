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
import { useStoryblok } from "../../hooks/useStoryblok";
import * as LucideIcons from "lucide-react";

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Home;
};

// Fallback content
const fallbackContent = {
  hero_badge: "Unsere Expertise",
  hero_title: "Tätigkeitsbereiche",
  hero_subtitle: "Die Rechtsanwaltskanzlei \"Girardi & Auer\" betreut klein- und mittelständische Unternehmen sowie Privatpersonen vor allem in folgenden Rechtsgebieten:",
  
  // Practice Areas (9)
  area_1_title: "Liegenschaftsrecht",
  area_1_desc: "Insbesondere Baurecht sowie Kauf-, Übergabe-, Bauträger- und Mietverträge",
  area_1_icon: "Home",
  
  area_2_title: "Vergaberecht",
  area_2_desc: "Beratung und Vertretung in allen Belangen des Vergaberechts",
  area_2_icon: "FileCheck",
  
  area_3_title: "Schadenersatzrecht",
  area_3_desc: "sowie Gewährleistungsrecht",
  area_3_icon: "FileText",
  
  area_4_title: "Ehe- und Scheidungsrecht",
  area_4_desc: "sowie Obsorge, Kontakt- und Unterhaltsrecht",
  area_4_icon: "HeartHandshake",
  
  area_5_title: "Erbrecht",
  area_5_desc: "Vertretung im Verlassenschaftsverfahren und Erstellung von letztwilligen Verfügungen",
  area_5_icon: "Users",
  
  area_6_title: "Erwachsenenschutz",
  area_6_desc: "Erwachsenenvertretung und Beratung bei Vorsorgevollmachten",
  area_6_icon: "HeartHandshake",
  
  area_7_title: "Unternehmensgründung",
  area_7_desc: "Beratung bei Gründung und Erstellung von Gesellschaftsverträgen",
  area_7_icon: "Building",
  
  area_8_title: "Inkassowesen und Forderungsbetreibung",
  area_8_desc: "Professionelle Durchsetzung Ihrer Ansprüche",
  area_8_icon: "TrendingUp",
  
  area_9_title: "Rechtsgutachten",
  area_9_desc: "Fundierte rechtliche Bewertungen und Einschätzungen",
  area_9_icon: "Search",
  
  // Additional Info
  info_title: "Umfassende rechtliche Beratung",
  info_para_1: "Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, auch komplexe rechtliche Sachverhalte kompetent und zuverlässig zu bearbeiten. Wir vertreten Ihre Interessen sowohl außergerichtlich als auch vor Gericht.",
  info_para_2: "Sollten Sie Fragen zu einem Rechtsgebiet haben, das hier nicht aufgeführt ist, kontaktieren Sie uns gerne. Wir beraten Sie umfassend oder vermitteln Ihnen bei Bedarf qualifizierte Kollegen aus unserem Netzwerk.",
  info_cta_text: "Beratungstermin vereinbaren",
  info_cta_link: "/kontakt",
  
  // Partner Section
  partner_title: "Ihr verlässlicher Partner",
  partner_subtitle: "Was Sie von unserer Kanzlei erwarten können",
  
  partner_1_title: "Fundierte Expertise",
  partner_1_desc: "Profundes rechtliches Fachwissen in allen relevanten Bereichen des Zivil- und Wirtschaftsrechts.",
  partner_1_icon: "FileCheck",
  
  partner_2_title: "Individuelle Betreuung",
  partner_2_desc: "Persönlicher Ansprechpartner und maßgeschneiderte Lösungen für Ihre spezifische Situation.",
  partner_2_icon: "Users",
  
  partner_3_title: "Engagierte Vertretung",
  partner_3_desc: "Leidenschaftlicher Einsatz für Ihre Rechte – außergerichtlich und vor Gericht.",
  partner_3_icon: "Scale",
  
  bookshelf_image: { filename: "" },
  
  // SEO
  seo_title: "Rechtsgebiete - Liegenschaftsrecht, Familienrecht & mehr | Girardi & Auer",
  seo_description: "9 Rechtsgebiete mit Expertise: Liegenschaftsrecht, Baurecht, Familienrecht, Erbrecht, Unternehmensrecht, Schadenersatz & mehr. ✓ Erfahrene Anwälte in Innsbruck",
  seo_keywords: "Liegenschaftsrecht Innsbruck, Familienrecht Tirol, Erbrecht, Baurecht, Unternehmensrecht, Schadenersatzrecht"
};

export function PracticeAreasPage() {
  const story = useStoryblok('practice-areas');
  const pageContent = story?.content || fallbackContent;
  
  // Build practice areas array from content
  const practiceAreas = [];
  for (let i = 1; i <= 9; i++) {
    const area = {
      title: pageContent[`area_${i}_title`] || "",
      description: pageContent[`area_${i}_desc`] || "",
      iconName: pageContent[`area_${i}_icon`] || "Home",
      color: i === 1 ? "from-[#1a365d] to-[#0f2744]" : 
             i % 3 === 0 ? "from-slate-700 to-slate-800" :
             i % 3 === 1 ? "from-slate-600 to-slate-700" : "from-slate-500 to-slate-600"
    };
    if (area.title) practiceAreas.push(area);
  }

  return (
    <>
      <Helmet>
        <title>{pageContent.seo_title}</title>
        <meta
          name="description"
          content={pageContent.seo_description}
        />
        <meta name="keywords" content={pageContent.seo_keywords} />
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
              <span className="text-sm font-medium text-slate-700">{pageContent.hero_badge}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {pageContent.hero_title}
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              {pageContent.hero_subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area) => {
              const Icon = getIconComponent(area.iconName);
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
            {pageContent.info_title}
          </h2>
          
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
            <p>
              {pageContent.info_para_1}
            </p>
            
            <p>
              {pageContent.info_para_2}
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              to={pageContent.info_cta_link}
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl hover:bg-slate-100 transition-all font-medium shadow-xl"
            >
              {pageContent.info_cta_text}
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
              {pageContent.partner_title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {pageContent.partner_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#0f2744] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {pageContent.partner_1_title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {pageContent.partner_1_desc}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {pageContent.partner_2_title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {pageContent.partner_2_desc}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {pageContent.partner_3_title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {pageContent.partner_3_desc}
              </p>
            </div>
          </div>

          {/* Bookshelf Image */}
          <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src={pageContent.bookshelf_image.filename}
              alt="Rechtsbücher in der Kanzlei"
              className="w-full h-full object-cover aspect-[21/9]"
            />
          </div>
        </div>
      </section>
    </>
  );
}