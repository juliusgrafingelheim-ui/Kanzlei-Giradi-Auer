import { Helmet } from "react-helmet-async";
import { Award, Users, Target, TrendingUp, Mail, ArrowRight, Scale, Shield, Briefcase, GraduationCap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useStoryblok } from "../../hooks/useStoryblok";
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName: string) => {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || Award;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const imgOffice1 = "https://images.unsplash.com/photo-1571055931484-22dce9d6c510?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXclMjBvZmZpY2UlMjBpbnRlcmlvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzM3NTc5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const teamMembers = [
  {
    name: "Dr. Thomas Girardi",
    title: "Rechtsanwalt",
    role: "Kanzleigründer",
    image: "",
    description:
      "Dr. Thomas Girardi ist seit 1988 als Rechtsanwalt eingetragen und auf Wirtschaftsrecht mit Schwerpunkt Immobilien-, Vertrags-, Bau-, Miet- und Erbrecht spezialisiert.",
    since: "Seit 1989",
    specializations: [
      "Wirtschaftsrecht",
      "Immobilienrecht",
      "Vertragsrecht",
      "Baurecht",
      "Miet- und Erbrecht",
    ],
    isLawyer: true,
  },
  {
    name: "DI (FH) Mag. Bernd Auer",
    title: "Rechtsanwalt",
    role: "Regiepartner",
    image: "",
    description:
      "Mag. Bernd Auer ist seit 2010 selbständiger Rechtsanwalt und Regiepartner der Kanzleigemeinschaft. Seine Fachgebiete umfassen insbesondere Familien-, Schadenersatz-, Versicherungs-, Erb- und Vertragsrecht.",
    since: "Seit 2010",
    specializations: [
      "Familienrecht",
      "Schadenersatzrecht",
      "Versicherungsrecht",
      "Erbrecht",
      "Vertragsrecht",
    ],
    isLawyer: true,
  },
  {
    name: "Mag. Anna Girardi",
    title: "Rechtsanwältin",
    role: "Regiepartnerin",
    image: "",
    description:
      "Mag. Anna Girardi ist seit April 2025 als selbstständige Rechtsanwältin eingetragen und Regiepartnerin der Kanzleigemeinschaft. Zudem ist sie ausgebildete Mediatorin, Konflikt-Coach und systemischer Coach.",
    since: "Seit 2025",
    specializations: [
      "Familienrecht",
      "Mietrecht",
      "Mediation",
      "Konflikt-Coaching",
    ],
    isLawyer: true,
  },
  {
    name: "Mag. B.A. Constanze Girardi",
    title: "Rechtsanwaltsanwärterin",
    role: "Team",
    image: "",
    description:
      "Constanze Girardi ist als Rechtsanwaltsanwärterin Teil unseres Teams und unterstützt die Kanzlei in allen rechtlichen Belangen.",
    since: "Team",
    specializations: [],
    isLawyer: false,
  },
  {
    name: "Monika Girardi",
    title: "Kanzleiassistenz",
    role: "Team",
    image: "",
    description:
      "Monika Girardi ist seit 1989 als Kanzleiassistenz tätig und die erste Ansprechpartnerin für unsere Klienten.",
    since: "Seit 1989",
    specializations: [],
    isLawyer: false,
  },
];

const timeline = [
  {
    year: "1989",
    title: "Die Gründung",
    description: "RA Dr. Thomas Girardi gründet nach seiner Ausbildung bei einem renommierten Wirtschaftsanwalt seine eigene Rechtsanwaltskanzlei in Innsbruck.",
  },
  {
    year: "2010",
    title: "Erster Regiepartner",
    description: "RA DI (FH) Mag. Bernd Auer tritt nach seiner Ausbildung bei RA Dr. Thomas Girardi als Regiepartner in die Kanzlei ein.",
  },
  {
    year: "2025",
    title: "Die nächste Generation",
    description: "RA Mag. Anna Girardi tritt nach ihrer Ausbildung in der Kanzlei Girardi & Auer ebenfalls als Regiepartnerin ein.",
  },
];

export function AboutPage() {
  const { content } = useStoryblok('pages/about');
  const c = content as any;

  // Helper to extract image URL from Storyblok asset field
  // Storyblok can return: { filename: "url" }, "url", "", null, or undefined
  const getAssetUrl = (field: any): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field.filename) return field.filename;
    return "";
  };

  // Build team: start with hardcoded fallback, then overlay ANY Storyblok fields
  // This ensures images from Storyblok are used even if not all text fields are populated
  const team = teamMembers.map((fallback, idx) => {
    const i = idx + 1;
    if (!c) return fallback;

    // Collect specializations from Storyblok (if any)
    const specs: string[] = [];
    for (let s = 1; s <= 6; s++) {
      const sp = c[`member_${i}_spec_${s}`];
      if (sp) specs.push(sp);
    }

    // Get Storyblok image for this member
    const sbImage = getAssetUrl(c[`member_${i}_image`]);

    // Debug: log what Storyblok returns for this member's image field
    if (import.meta.env.DEV) {
      const raw = c[`member_${i}_image`];
      if (raw) console.info(`[About] member_${i}_image raw:`, raw, '→ resolved:', sbImage);
    }

    return {
      ...fallback,
      name: c[`member_${i}_name`] || fallback.name,
      title: c[`member_${i}_title`] || fallback.title,
      role: c[`member_${i}_role`] || fallback.role,
      image: sbImage || fallback.image,
      description: c[`member_${i}_description`] || fallback.description,
      since: c[`member_${i}_since`] || fallback.since,
      specializations: specs.length > 0 ? specs : fallback.specializations,
    };
  });

  // Build timeline from Storyblok or fallback
  const timelineData = [];
  for (let i = 1; i <= 3; i++) {
    const year = c?.[`timeline_${i}_year`];
    if (year) {
      timelineData.push({ year, title: c[`timeline_${i}_title`] || "", description: c[`timeline_${i}_desc`] || "" });
    }
  }
  const timelineList = timelineData.length > 0 ? timelineData : timeline;

  // Build values from Storyblok or fallback
  const valuesData = [];
  for (let i = 1; i <= 4; i++) {
    const title = c?.[`value_${i}_title`];
    if (title) {
      valuesData.push({
        icon: getIconComponent(c[`value_${i}_icon`] || "Award"),
        title,
        desc: c[`value_${i}_desc`] || "",
        accent: i === 1 ? "from-[#1a365d] to-[#0f2744]" : i === 2 ? "from-slate-700 to-slate-800" : i === 3 ? "from-slate-600 to-slate-700" : "from-slate-500 to-slate-600",
      });
    }
  }
  const defaultValues = [
    { icon: Shield, title: "Vertrauen & Integrität", desc: "Ehrliche und transparente Beratung bildet das Fundament unserer Arbeit.", accent: "from-[#1a365d] to-[#0f2744]" },
    { icon: Users, title: "Persönliche Betreuung", desc: "Jeder Klient erhält individuelle Aufmerksamkeit und maßgeschneiderte Lösungen.", accent: "from-slate-700 to-slate-800" },
    { icon: Target, title: "Zielorientierung", desc: "Wir arbeiten konsequent auf das bestmögliche Ergebnis für Sie hin.", accent: "from-slate-600 to-slate-700" },
    { icon: TrendingUp, title: "Kontinuierliche Weiterentwicklung", desc: "Wir bilden uns stetig fort, um Ihnen aktuelle rechtliche Expertise zu bieten.", accent: "from-slate-500 to-slate-600" },
  ];
  const valuesList = valuesData.length > 0 ? valuesData : defaultValues;

  // Build sekretariat from Storyblok or fallback
  const sekretariatData = [];
  for (let i = 1; i <= 3; i++) {
    const name = c?.[`sekretariat_${i}_name`];
    if (name) sekretariatData.push({ name, title: c[`sekretariat_${i}_title`] || "Kanzleiassistenz" });
  }
  const sekretariat = sekretariatData.length > 0 ? sekretariatData : [
    { name: "Doris Blahut", title: "Kanzleiassistenz" },
    { name: "Iva Federfová", title: "Kanzleiassistenz" },
    { name: "Carina Schuler", title: "Kanzleiassistenz" },
  ];

  // Fallback-safe getters
  const heroImage = getAssetUrl(c?.hero_image) || imgOffice1;
  const seoTitle = c?.seo_title || "Über uns - Erfahrene Rechtsanwälte seit 1989 | Girardi & Auer";
  const seoDesc = c?.seo_description || "Lernen Sie das Team der Kanzlei Girardi & Auer kennen.";

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="keywords" content="Rechtsanwalt Team Innsbruck, Dr. Thomas Girardi, Bernd Auer, Anna Girardi, Anwalt Tirol" />
        <link rel="canonical" href="https://www.girardi-auer.com/ueber-uns" />
        <meta property="og:title" content="Über uns | Rechtsanwaltskanzlei Girardi & Auer" />
        <meta property="og:description" content="Lernen Sie das Team der Kanzlei Girardi & Auer kennen. Erfahrene Rechtsanwälte in Innsbruck seit 1989." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.girardi-auer.com/ueber-uns" />
      </Helmet>

      {/* Hero - Full Width Dark */}
      <section className="relative pt-32 pb-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full mb-8">
                <Award className="w-4 h-4" />
                <span className="text-sm">{c?.hero_badge || "Seit 1989 in Innsbruck"}</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.1] tracking-tight">
                {c?.hero_title_line1 || "Tradition trifft"}<br />
                <span className="text-slate-400">{c?.hero_title_line2 || "Kompetenz"}</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-lg text-slate-300 leading-relaxed mb-10 max-w-lg">
                {c?.hero_description || "Drei Generationen rechtlicher Expertise unter einem Dach. Wir verbinden langjährige Erfahrung mit modernem Denken für die beste Lösung Ihrer rechtlichen Anliegen."}
              </motion.p>

              <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-8">
                {[
                  { value: c?.hero_stat_1_value || "35+", label: c?.hero_stat_1_label || "Jahre Erfahrung" },
                  { value: c?.hero_stat_2_value || "9", label: c?.hero_stat_2_label || "Rechtsgebiete" },
                  { value: c?.hero_stat_3_value || "3", label: c?.hero_stat_3_label || "Rechtsanwälte" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl sm:text-4xl text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <ImageWithFallback
                  src={heroImage}
                  alt="Kanzlei Girardi & Auer"
                  className="w-full h-full object-cover aspect-[4/3]"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-900">Tiroler RAK</div>
                    <div className="text-xs text-slate-500">Eingetragene Kanzlei</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
              <Scale className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">Unsere Geschichte</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              Über drei Jahrzehnte Rechtsberatung
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              Von der Gründung bis zur nächsten Generation – ein Überblick über unsere Kanzleigeschichte
            </motion.p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2"></div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-16"
            >
              {timelineList.map((item, index) => (
                <motion.div
                  key={item.year}
                  variants={fadeInUp}
                  className={`relative flex items-start gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#0f2744] rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                      <span className="text-white text-sm">{item.year}</span>
                    </div>
                  </div>

                  <div className={`ml-20 lg:ml-0 lg:w-1/2 ${
                    index % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16 lg:ml-auto"
                  }`}>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-20"
          >
            <div className="relative bg-[#1a365d] rounded-2xl p-10 text-center">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1a365d] rotate-45"></div>
              <p className="text-lg text-white leading-relaxed italic">
                &ldquo;{c?.quote_text || "Besonderen Wert legt die Kanzlei auf eine allumfassende Rechtsberatung und den persönlichen Kontakt zu ihren Klienten."}&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values - Horizontal Bento */}
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
              Unsere Werte
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              Was uns auszeichnet und antreibt
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-6"
          >
            {valuesList.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="group bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:border-[#1a365d]/20 relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${value.accent} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300`}></div>
                <div className="flex gap-6">
                  <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${value.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team - All 5 Members */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
              <Briefcase className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-600">{c?.team_badge || "Unser Team"}</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              {c?.team_title || "Die Menschen hinter der Kanzlei"}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              {c?.team_subtitle || "Lernen Sie die Menschen kennen, die sich mit Leidenschaft und Expertise für Ihre rechtlichen Anliegen einsetzen."}
            </motion.p>
          </motion.div>

          <div className="space-y-20">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={stagger}
                className="grid lg:grid-cols-5 gap-10 items-start"
              >
                {/* Image - Square */}
                <motion.div
                  variants={fadeInUp}
                  className={`lg:col-span-2 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <div className="relative group">
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-xl ring-1 ring-slate-200">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Year badge */}
                    <div className="absolute -bottom-4 right-6 bg-[#1a365d] text-white px-5 py-2.5 rounded-xl shadow-lg">
                      <div className="text-sm">{member.since}</div>
                    </div>
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  variants={fadeInUp}
                  className={`lg:col-span-3 flex flex-col justify-center ${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <div className="inline-flex items-center gap-2 text-sm text-[#1a365d] bg-[#1a365d]/5 px-3 py-1 rounded-full w-fit mb-4">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {member.role}
                  </div>
                  <h3 className="text-3xl sm:text-4xl text-slate-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-lg text-[#1a365d] mb-6">
                    {member.title}
                  </p>
                  <p className="text-slate-600 leading-relaxed mb-8 max-w-xl">
                    {member.description}
                  </p>

                  {member.specializations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-3">
                        Schwerpunkte
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-3 py-1.5 bg-slate-50 text-slate-700 text-sm rounded-lg border border-slate-200 hover:border-[#1a365d]/30 hover:bg-[#1a365d]/5 transition-colors"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <a
                    href="mailto:info@girardi-auer.com"
                    className="inline-flex items-center gap-2 text-[#1a365d] hover:text-[#152d4d] group/link w-fit"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Kontakt aufnehmen</span>
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sekretariat - Dark Banner (only secretariat staff) */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl mb-4">
                {c?.sekretariat_title || "Gemeinsam stark für Sie"}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {c?.sekretariat_subtitle || "Unser Sekretariat sorgt dafür, dass alles reibungslos abläuft. Sie sind Ihre ersten Ansprechpartner bei Terminvereinbarungen und organisatorischen Fragen."}
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <h3 className="text-lg text-slate-400 mb-6">Sekretariat</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {sekretariat.map((s) => (
                  <div
                    key={s.name}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="text-white">{s.name}</span>
                    <div className="text-sm text-slate-400 mt-1">{s.title}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-12 lg:p-16 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1a365d]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl text-slate-900 mb-4">
                  {c?.cta_title || "Bereit für ein Gespräch?"}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {c?.cta_description || "Vereinbaren Sie ein unverbindliches Erstgespräch und lernen Sie uns persönlich kennen. Wir freuen uns auf Sie."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center gap-2 bg-[#1a365d] text-white px-8 py-4 rounded-xl hover:bg-[#152d4d] transition-all shadow-lg shadow-[#1a365d]/20 hover:shadow-xl hover:-translate-y-0.5 group"
                >
                  {c?.cta_button_text || "Kontakt aufnehmen"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="tel:+43512574095"
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                >
                  {c?.cta_phone || "+43 512 574095"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}