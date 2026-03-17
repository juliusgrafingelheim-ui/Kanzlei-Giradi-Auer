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
  ArrowRight,
  Phone,
  MessageSquare,
  ClipboardList,
  Target,
  Gavel,
  Shield,
} from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useStoryblok } from "../../hooks/useStoryblok";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Home;
};

const fallbackContent = {
  hero_badge: "Unsere Expertise",
  hero_title: "Tätigkeitsbereiche",
  hero_subtitle: "Die Rechtsanwaltskanzlei \"Girardi & Auer\" betreut klein- und mittelständische Unternehmen sowie Privatpersonen vor allem in folgenden Rechtsgebieten:",

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

  info_title: "Umfassende rechtliche Beratung",
  info_para_1: "Unsere langjährige Erfahrung und fundierte Ausbildung ermöglichen es uns, auch komplexe rechtliche Sachverhalte kompetent und zuverlässig zu bearbeiten. Wir vertreten Ihre Interessen sowohl außergerichtlich als auch vor Gericht.",
  info_para_2: "Sollten Sie Fragen zu einem Rechtsgebiet haben, das hier nicht aufgeführt ist, kontaktieren Sie uns gerne. Wir beraten Sie umfassend oder vermitteln Ihnen bei Bedarf qualifizierte Kollegen aus unserem Netzwerk.",
  info_cta_text: "Beratungstermin vereinbaren",
  info_cta_link: "/kontakt",

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

  seo_title: "Rechtsgebiete - Liegenschaftsrecht, Familienrecht & mehr | Girardi & Auer",
  seo_description: "9 Rechtsgebiete mit Expertise: Liegenschaftsrecht, Baurecht, Familienrecht, Erbrecht, Unternehmensrecht, Schadenersatz & mehr. Erfahrene Anwälte in Innsbruck",
  seo_keywords: "Liegenschaftsrecht Innsbruck, Familienrecht Tirol, Erbrecht, Baurecht, Unternehmensrecht, Schadenersatzrecht"
};

const processSteps = [
  {
    icon: Phone,
    step: "01",
    title: "Erstgespräch",
    desc: "Kostenlose und unverbindliche Erstberatung zu Ihrem Anliegen.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Analyse",
    desc: "Sorgfältige Prüfung Ihrer Situation und der rechtlichen Lage.",
  },
  {
    icon: Target,
    step: "03",
    title: "Strategie",
    desc: "Entwicklung einer maßgeschneiderten Vorgehensweise.",
  },
  {
    icon: Gavel,
    step: "04",
    title: "Umsetzung",
    desc: "Engagierte Vertretung Ihrer Interessen bis zum Ergebnis.",
  },
];

export function PracticeAreasPage() {
  const { content } = useStoryblok('pages/practice-areas');
  const pageContent = content || fallbackContent;

  const practiceAreas = [];
  for (let i = 1; i <= 9; i++) {
    const area = {
      title: pageContent[`area_${i}_title`] || "",
      description: pageContent[`area_${i}_desc`] || "",
      iconName: pageContent[`area_${i}_icon`] || "Home",
      number: String(i).padStart(2, "0"),
    };
    if (area.title) practiceAreas.push(area);
  }

  // Build process steps from Storyblok or fallback
  const storyblokSteps = [];
  for (let i = 1; i <= 4; i++) {
    const title = pageContent[`step_${i}_title`];
    if (title) {
      storyblokSteps.push({
        icon: getIconComponent(pageContent[`step_${i}_icon`] || "Phone"),
        step: String(i).padStart(2, "0"),
        title,
        desc: pageContent[`step_${i}_desc`] || "",
      });
    }
  }
  const steps = storyblokSteps.length > 0 ? storyblokSteps : processSteps;

  return (
    <>
      <Helmet>
        <title>{pageContent.seo_title}</title>
        <meta name="description" content={pageContent.seo_description} />
        <meta name="keywords" content={pageContent.seo_keywords} />
        <link rel="canonical" href="https://www.girardi-auer.com/rechtsgebiete" />
        <meta property="og:title" content="Rechtsgebiete | Girardi & Auer Innsbruck" />
        <meta property="og:description" content="Umfassende Rechtsberatung in 9 Fachgebieten." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.girardi-auer.com/rechtsgebiete" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/3 translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full mb-8">
              <Scale className="w-4 h-4" />
              <span className="text-sm">{pageContent.hero_badge}</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.1] tracking-tight">
              {pageContent.hero_title}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-slate-300 leading-relaxed max-w-xl">
              {pageContent.hero_subtitle}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="w-4 h-4" />
                <span>{pageContent.hero_stat_1 || "9 Rechtsgebiete"}</span>
              </div>
              <div className="w-px h-4 bg-slate-700"></div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Scale className="w-4 h-4" />
                <span>{pageContent.hero_stat_2 || "35+ Jahre Erfahrung"}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Practice Areas - Numbered List */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {practiceAreas.map((area) => {
              const Icon = getIconComponent(area.iconName);
              return (
                <motion.div
                  key={area.title}
                  variants={fadeInUp}
                  className="group relative bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-[#1a365d]/20 overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a365d] to-[#1a365d]/40 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>

                  {/* Large number bg */}
                  <div className="absolute top-4 right-4 text-6xl text-slate-100 group-hover:text-[#1a365d]/10 transition-colors select-none pointer-events-none">
                    {area.number}
                  </div>

                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1a365d]/5 group-hover:bg-[#1a365d]/10 transition-colors mb-6">
                      <Icon className="h-6 w-6 text-[#1a365d]" />
                    </div>

                    <h3 className="text-xl text-slate-900 mb-3 group-hover:text-[#1a365d] transition-colors">
                      {area.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Process - How We Work */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200/70 rounded-full mb-4">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">{pageContent.process_badge || "Unser Vorgehen"}</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              {pageContent.process_title || "So arbeiten wir mit Ihnen"}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              {pageContent.process_subtitle || "Von der ersten Kontaktaufnahme bis zum erfolgreichen Abschluss"}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, index) => (
              <motion.div key={step.step} variants={fadeInUp} className="relative">
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+32px)] w-[calc(100%-32px)] h-px bg-slate-200"></div>
                )}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 mb-6 mx-auto">
                    <step.icon className="w-8 h-8 text-[#1a365d]" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#1a365d] rounded-full flex items-center justify-center text-xs text-white">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Deep Dive CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl mb-6">
            {pageContent.info_title}
          </motion.h2>

          <motion.div variants={fadeInUp} className="space-y-6 text-lg text-slate-300 leading-relaxed mb-12">
            <p>{pageContent.info_para_1}</p>
            <p>{pageContent.info_para_2}</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={pageContent.info_cta_link}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1a365d] px-8 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-0.5 group"
            >
              {pageContent.info_cta_text}
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
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              {pageContent.partner_title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              {pageContent.partner_subtitle}
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
              { icon: FileCheck, title: pageContent.partner_1_title, desc: pageContent.partner_1_desc, accent: "from-[#1a365d] to-[#0f2744]" },
              { icon: Users, title: pageContent.partner_2_title, desc: pageContent.partner_2_desc, accent: "from-slate-600 to-slate-700" },
              { icon: Scale, title: pageContent.partner_3_title, desc: pageContent.partner_3_desc, accent: "from-slate-500 to-slate-600" },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                className="text-center bg-slate-50 rounded-2xl p-10 border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.accent} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}