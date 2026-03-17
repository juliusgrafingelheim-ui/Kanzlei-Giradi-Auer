import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Scale, Award, Users, MapPin } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useStoryblok } from "../../hooks/useStoryblok";
import * as LucideIcons from "lucide-react";

// Icon Mapper
const getIcon = (iconName: string, className: string = "w-5 h-5") => {
  const Icon = (LucideIcons as any)[iconName] || Scale;
  return <Icon className={className} />;
};

// Fallback Content
const FALLBACK_CONTENT = {
  hero_title: "Ihre Rechtsanwälte in Innsbruck",
  hero_subtitle: "Seit 1989 vertreten wir Ihre Interessen mit Kompetenz, Erfahrung und persönlichem Engagement. Vertrauen Sie auf unsere Expertise in allen Rechtsfragen.",
  hero_cta_text: "Beratungstermin vereinbaren",
  hero_cta_link: "/kontakt",
  stat_1_number: "35+",
  stat_1_label: "Jahre Erfahrung",
  stat_2_number: "9",
  stat_2_label: "Rechtsgebiete",
  stat_3_number: "5",
  stat_3_label: "Experten",
  expertise_title: "Unsere Expertise",
  expertise_subtitle: "Umfassende Rechtsberatung in allen relevanten Bereichen",
  feature_1_title: "Liegenschaftsrecht",
  feature_1_desc: "Baurecht, Kauf- und Mietverträge",
  feature_1_icon: "Home",
  feature_2_title: "Familienrecht",
  feature_2_desc: "Ehe, Scheidung, Obsorge & Unterhalt",
  feature_2_icon: "HeartHandshake",
  feature_3_title: "Erbrecht",
  feature_3_desc: "Verlassenschaft & Testamente",
  feature_3_icon: "Users",
  feature_4_title: "Unternehmensrecht",
  feature_4_desc: "Gründung & Gesellschaftsverträge",
  feature_4_icon: "Building",
  team_section_title: "Unser Team",
  team_section_subtitle: "Erfahrene Rechtsanwälte mit Engagement und Fachkompetenz",
  why_title: "Warum Girardi & Auer?",
  why_1_title: "Langjährige Erfahrung",
  why_1_desc: "Seit 1989 betreuen wir erfolgreich Privatpersonen und Unternehmen in Tirol und darüber hinaus.",
  why_1_icon: "Award",
  why_2_title: "Persönliche Betreuung",
  why_2_desc: "Ihre Anliegen erhalten stets die volle persönliche Aufmerksamkeit unseres erfahrenen Teams.",
  why_2_icon: "Users",
  why_3_title: "Umfassende Expertise",
  why_3_desc: "Neun Rechtsgebiete und fundierte Ausbildung für kompetente und zuverlässige Beratung.",
  why_3_icon: "Scale",
  location_badge: "Innsbruck Zentrum",
  location_title: "Brauchen Sie rechtliche Beratung?",
  location_subtitle: "Vereinbaren Sie noch heute einen Termin für ein unverbindliches Erstgespräch.",
  location_cta_text: "Jetzt Kontakt aufnehmen",
  location_cta_link: "/kontakt",
  seo_title: "Rechtsanwalt Innsbruck | Girardi & Auer | Seit 1989",
  seo_description: "Erfahrene Rechtsanwälte in Innsbruck seit 1989. Spezialisiert auf Liegenschaftsrecht, Baurecht, Vertragsrecht & mehr. ✓ Persönliche Betreuung ✓ Jetzt Termin vereinbaren!",
  seo_keywords: "Rechtsanwalt Innsbruck, Anwalt Tirol, Rechtsberatung Innsbruck"
};

export function HomePage() {
  const { content, loading } = useStoryblok('home');

  // Use Storyblok content or fallback
  const pageContent = content || FALLBACK_CONTENT;

  if (loading && !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Inhalte werden geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageContent.seo_title}</title>
        <meta name="description" content={pageContent.seo_description} />
        <meta name="keywords" content={pageContent.seo_keywords} />
        <link rel="canonical" href="https://www.girardi-auer.com/" />
        <meta property="og:title" content={pageContent.seo_title} />
        <meta property="og:description" content={pageContent.seo_description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.girardi-auer.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-50"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-8">
                <Scale className="w-4 h-4 text-slate-700" />
                <span className="text-sm font-medium text-slate-700">Seit 1989 in Innsbruck</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]">
                {pageContent.hero_title}
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl">
                {pageContent.hero_subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={pageContent.hero_cta_link}
                  className="group inline-flex items-center justify-center gap-2 bg-[#1a365d] text-white px-8 py-4 rounded-xl hover:bg-[#152d4d] transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30"
                >
                  {pageContent.hero_cta_text}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/rechtsgebiete"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
                >
                  Rechtsgebiete ansehen
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 md:gap-8 mt-20 pt-12 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{pageContent.stat_1_number}</div>
                  <div className="text-sm text-slate-600">{pageContent.stat_1_label}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{pageContent.stat_2_number}</div>
                  <div className="text-sm text-slate-600">{pageContent.stat_2_label}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{pageContent.stat_3_number}</div>
                  <div className="text-sm text-slate-600">{pageContent.stat_3_label}</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src=""
                alt="Kanzlei Büro"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {pageContent.expertise_title}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {pageContent.expertise_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: pageContent.feature_1_title, desc: pageContent.feature_1_desc, icon: pageContent.feature_1_icon },
              { title: pageContent.feature_2_title, desc: pageContent.feature_2_desc, icon: pageContent.feature_2_icon },
              { title: pageContent.feature_3_title, desc: pageContent.feature_3_desc, icon: pageContent.feature_3_icon },
              { title: pageContent.feature_4_title, desc: pageContent.feature_4_desc, icon: pageContent.feature_4_icon },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl hover:shadow-lg transition-all border border-slate-100 hover:border-slate-200"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow transition-shadow">
                  {getIcon(feature.icon, "w-6 h-6 text-[#1a365d]")}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-[#1a365d] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rechtsgebiete"
              className="inline-flex items-center gap-2 text-[#1a365d] hover:text-[#152d4d] font-medium"
            >
              Alle Rechtsgebiete ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Unser Team</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {pageContent.team_section_title}
              </h2>
              
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {pageContent.team_section_subtitle}
              </p>

              <Link
                to="/ueber-uns"
                className="inline-flex items-center gap-2 text-white hover:text-slate-300 font-medium transition-colors"
              >
                Team kennenlernen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800">
                  <ImageWithFallback
                    src=""
                    alt="Dr. Thomas Girardi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800">
                  <ImageWithFallback
                    src=""
                    alt="DI Mag. Bernd Auer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              {pageContent.why_title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: pageContent.why_1_title, desc: pageContent.why_1_desc, icon: pageContent.why_1_icon },
              { title: pageContent.why_2_title, desc: pageContent.why_2_desc, icon: pageContent.why_2_icon },
              { title: pageContent.why_3_title, desc: pageContent.why_3_desc, icon: pageContent.why_3_icon },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {getIcon(item.icon, "w-8 h-8 text-[#1a365d]")}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-24 bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{pageContent.location_badge}</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {pageContent.location_title}
              </h2>
              
              <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                {pageContent.location_subtitle}
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span className="text-slate-200">Stainerstraße 2, 6020 Innsbruck</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span className="text-slate-200">+43 512 574095</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                  <span className="text-slate-200">info@girardi-auer.com</span>
                </div>
              </div>

              <Link
                to={pageContent.location_cta_link}
                className="inline-flex items-center gap-2 bg-white text-[#1a365d] px-8 py-4 rounded-xl hover:bg-slate-100 transition-all font-medium shadow-xl"
              >
                {pageContent.location_cta_text}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl h-[400px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1662129267147-8255b376a4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbm5zYnJ1Y2slMjBhdXN0cmlhJTIwbW91bnRhaW5zJTIwY2l0eXxlbnwxfHx8fDE3NzM3Mzg4Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Innsbruck"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}