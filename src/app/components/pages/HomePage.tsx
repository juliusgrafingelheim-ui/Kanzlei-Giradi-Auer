import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Scale, Award, Users, MapPin, Phone, Shield, Clock, CheckCircle2, Home, HeartHandshake, Building, Briefcase, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useStoryblok } from "../../hooks/useStoryblok";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";

const getIcon = (iconName: string, className: string = "w-5 h-5") => {
  const Icon = (LucideIcons as any)[iconName] || Scale;
  return <Icon className={className} />;
};

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
  seo_description: "Erfahrene Rechtsanwälte in Innsbruck seit 1989. Spezialisiert auf Liegenschaftsrecht, Baurecht, Vertragsrecht & mehr. Persönliche Betreuung. Jetzt Termin vereinbaren!",
  seo_keywords: "Rechtsanwalt Innsbruck, Anwalt Tirol, Rechtsberatung Innsbruck"
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const teamPreview = [
  { name: "Dr. Thomas Girardi", role: "Rechtsanwalt · Kanzleigründer", since: "Seit 1989" },
  { name: "DI (FH) Mag. Bernd Auer", role: "Rechtsanwalt · Regiepartner", since: "Seit 2010" },
  { name: "Mag. Anna Girardi", role: "Rechtsanwältin · Regiepartnerin", since: "Seit 2025" },
  { name: "Mag. B.A. Constanze Girardi", role: "Rechtsanwaltsanwärterin", since: "" },
  { name: "Monika Girardi", role: "Kanzleiassistenz", since: "Seit 1989" },
];

const processStepsFallback = [
  { step: "01", title: "Erstgespräch", desc: "Kostenlose Erstberatung zu Ihrem Anliegen" },
  { step: "02", title: "Analyse", desc: "Sorgfältige Prüfung Ihrer rechtlichen Situation" },
  { step: "03", title: "Strategie", desc: "Maßgeschneiderte Vorgehensweise für Sie" },
  { step: "04", title: "Umsetzung", desc: "Engagierte Vertretung bis zum Ergebnis" },
];

export function HomePage() {
  const { content, loading } = useStoryblok('pages/home');
  const c = content || FALLBACK_CONTENT;

  // Helper to extract image URL from Storyblok asset field
  // Storyblok can return: { filename: "url" }, "url", "", null, or undefined
  const getAssetUrl = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field.filename) return field.filename;
    return "";
  };

  // Build team from Storyblok or fallback
  const teamList = [];
  for (let i = 1; i <= 5; i++) {
    const name = c[`team_${i}_name`];
    if (name) teamList.push({ name, role: c[`team_${i}_role`] || "", since: c[`team_${i}_since`] || "" });
  }
  const team = teamList.length > 0 ? teamList : teamPreview;

  // Build process steps from Storyblok or fallback
  const processSteps = [];
  for (let i = 1; i <= 4; i++) {
    const title = c[`process_${i}_title`];
    if (title) processSteps.push({ step: c[`process_${i}_step`] || String(i).padStart(2, "0"), title, desc: c[`process_${i}_desc`] || "" });
  }
  if (processSteps.length === 0) processSteps.push(...processStepsFallback);

  const pageContent = c;

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

      {/* Hero Section - Split Dark/Light */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Dark left half bg */}
        <div className="absolute inset-0 bg-slate-900 lg:bg-transparent">
          <div className="hidden lg:block absolute inset-y-0 left-0 w-[55%] bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
          <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
          <div className="hidden lg:block absolute inset-y-0 right-0 w-[45%] bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>
        </div>
        <div className="absolute top-0 left-[40%] w-[500px] h-[500px] bg-[#1a365d]/10 rounded-full blur-[128px]"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-white"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full mb-8">
                <Scale className="w-4 h-4" />
                <span className="text-sm">Seit 1989 in Innsbruck</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-[1.08] tracking-tight">
                {pageContent.hero_title}
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-slate-300 mb-10 leading-relaxed max-w-xl">
                {pageContent.hero_subtitle}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={pageContent.hero_cta_link || "/kontakt"}
                  className="group inline-flex items-center justify-center gap-2 bg-white text-[#1a365d] px-8 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                >
                  {pageContent.hero_cta_text || "Beratungstermin vereinbaren"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="tel:+43512574095"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  +43 512 574095
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/10">
                {[
                  { number: pageContent.stat_1_number || "35+", label: pageContent.stat_1_label || "Jahre Erfahrung" },
                  { number: pageContent.stat_2_number || "9", label: pageContent.stat_2_label || "Rechtsgebiete" },
                  { number: pageContent.stat_3_number || "5", label: pageContent.stat_3_label || "Experten" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl sm:text-4xl text-white mb-1">{stat.number}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={getAssetUrl(pageContent.hero_image) || "https://images.unsplash.com/photo-1571055931484-22dce9d6c510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXclMjBvZmZpY2UlMjBpbnRlcmlvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM3NTc5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                  alt="Kanzlei Girardi & Auer Büro"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
              {/* Floating trust badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-2xl px-6 py-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-900">Tiroler Rechtsanwaltskammer</div>
                    <div className="text-xs text-slate-500">Eingetragene Kanzlei</div>
                  </div>
                </div>
              </div>
              {/* Second floating badge */}
              <div className="absolute -top-4 -right-4 bg-[#1a365d] rounded-xl shadow-2xl px-5 py-3 text-white">
                <div className="text-2xl">35+</div>
                <div className="text-xs text-slate-300">Jahre</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-5 bg-[#1a365d] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-white/80 text-sm">
            {[
              "Unverbindliches Erstgespräch",
              "35+ Jahre Erfahrung",
              "Persönliche Betreuung",
              "Zentral in Innsbruck",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white/50" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work - Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">Unser Vorgehen</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              In vier Schritten zu Ihrem Recht
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              Klar, strukturiert und immer an Ihrer Seite
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="relative group"
              >
                {/* Connecting line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-48px)] h-px bg-slate-200"></div>
                )}
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:border-[#1a365d]/20 transition-all text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#1a365d] rounded-full flex items-center justify-center text-xs text-white shadow-md">
                    {step.step}
                  </div>
                  <div className="pt-4">
                    <h3 className="text-lg text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 mb-4">
              <Scale className="w-4 h-4 text-[#1a365d]" />
              <span className="text-sm text-[#1a365d]">Fachgebiete</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              {pageContent.expertise_title || "Unsere Expertise"}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              {pageContent.expertise_subtitle || "Umfassende Rechtsberatung in allen relevanten Bereichen"}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: pageContent.feature_1_title, desc: pageContent.feature_1_desc, icon: pageContent.feature_1_icon },
              { title: pageContent.feature_2_title, desc: pageContent.feature_2_desc, icon: pageContent.feature_2_icon },
              { title: pageContent.feature_3_title, desc: pageContent.feature_3_desc, icon: pageContent.feature_3_icon },
              { title: pageContent.feature_4_title, desc: pageContent.feature_4_desc, icon: pageContent.feature_4_icon },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="group relative p-8 bg-white rounded-2xl hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-[#1a365d]/20 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a365d] to-[#1a365d]/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <div className="w-14 h-14 bg-[#1a365d]/5 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#1a365d]/10 transition-colors">
                  {getIcon(feature.icon, "w-7 h-7 text-[#1a365d]")}
                </div>
                <h3 className="text-xl text-slate-900 mb-2 group-hover:text-[#1a365d] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/rechtsgebiete"
              className="inline-flex items-center gap-2 bg-[#1a365d] text-white px-8 py-4 rounded-xl hover:bg-[#152d4d] transition-all shadow-lg shadow-[#1a365d]/20 hover:shadow-xl hover:-translate-y-0.5 group"
            >
              Alle 9 Rechtsgebiete ansehen
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Team Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
                <Briefcase className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Unser Team</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-6">
                {pageContent.team_section_title || "Unser Team"}
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-lg text-slate-600 mb-10 leading-relaxed">
                {pageContent.team_section_subtitle || "Erfahrene Rechtsanwälte mit Engagement und Fachkompetenz"}
              </motion.p>

              {/* Team names list */}
              <motion.div variants={fadeInUp} className="space-y-4 mb-10">
                {team.map((person) => (
                  <div key={person.name} className="flex items-center justify-between bg-slate-50 rounded-xl px-5 py-4 border border-slate-100 hover:border-[#1a365d]/20 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#1a365d] rounded-full"></div>
                      <div>
                        <span className="text-slate-900">{person.name}</span>
                        <span className="text-slate-400 text-sm ml-2 hidden sm:inline">{person.role}</span>
                      </div>
                    </div>
                    {person.since && (
                      <span className="text-xs text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">{person.since}</span>
                    )}
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Link
                  to="/ueber-uns"
                  className="inline-flex items-center gap-2 bg-[#1a365d] text-white px-6 py-3 rounded-xl hover:bg-[#152d4d] transition-all shadow-lg shadow-[#1a365d]/20 group"
                >
                  Team kennenlernen
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
                  <ImageWithFallback
                    src={getAssetUrl(pageContent.team_image_1) || ""}
                    alt="Dr. Thomas Girardi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
                  <ImageWithFallback
                    src={getAssetUrl(pageContent.team_image_3) || ""}
                    alt="Mag. Anna Girardi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xl">
                  <ImageWithFallback
                    src={getAssetUrl(pageContent.team_image_2) || ""}
                    alt="DI (FH) Mag. Bernd Auer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={getAssetUrl(pageContent.team_image_4) || ""}
                    alt="Mag. B.A. Constanze Girardi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              {pageContent.why_title || "Warum Girardi & Auer?"}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              {pageContent.why_subtitle || "Was uns seit über 35 Jahren auszeichnet"}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: pageContent.why_1_title, desc: pageContent.why_1_desc, icon: pageContent.why_1_icon, accent: "from-[#1a365d] to-[#0f2744]" },
              { title: pageContent.why_2_title, desc: pageContent.why_2_desc, icon: pageContent.why_2_icon, accent: "from-slate-600 to-slate-700" },
              { title: pageContent.why_3_title, desc: pageContent.why_3_desc, icon: pageContent.why_3_icon, accent: "from-slate-500 to-slate-600" },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-[#1a365d]/20 text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.accent} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform`}>
                  {getIcon(item.icon, "w-8 h-8 text-white")}
                </div>
                <h3 className="text-xl text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{pageContent.location_badge || "Innsbruck Zentrum"}</span>
              </motion.div>

              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl mb-6">
                {pageContent.location_title || "Brauchen Sie rechtliche Beratung?"}
              </motion.h2>

              <motion.p variants={fadeInUp} className="text-lg text-slate-300 mb-8 leading-relaxed">
                {pageContent.location_subtitle || "Vereinbaren Sie noch heute einen Termin für ein unverbindliches Erstgespräch."}
              </motion.p>

              <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">Stainerstraße 2, Innsbruck</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <a href="tel:+43512574095" className="text-slate-200 text-sm hover:text-white transition-colors">+43 512 574095</a>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">Mo-Fr: 08:00-12:00</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <Award className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">Erstgespräch kostenlos</span>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={pageContent.location_cta_link || "/kontakt"}
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1a365d] px-8 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl group hover:-translate-y-0.5"
                >
                  {pageContent.location_cta_text || "Jetzt Kontakt aufnehmen"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="tel:+43512574095"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Jetzt anrufen
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="rounded-2xl overflow-hidden shadow-2xl h-[400px] ring-1 ring-white/10"
            >
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1753741204751-9c7ffdbd6619?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJbm5zYnJ1Y2slMjBBdXN0cmlhJTIwY2l0eXNjYXBlJTIwbW91bnRhaW5zfGVufDF8fHx8MTc3Mzc1ODgxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Innsbruck Panorama"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}