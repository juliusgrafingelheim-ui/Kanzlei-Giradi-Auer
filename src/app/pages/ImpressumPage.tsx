import { Helmet } from "react-helmet-async";
import { Scale, MapPin, Phone, Mail, ExternalLink, Building } from "lucide-react";
import { motion } from "motion/react";
import { useStoryblok } from "../../hooks/useStoryblok";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const rechtsanwaelte = [
  {
    name: "RA Dr. Thomas Girardi",
    advm: "R802574",
    uid: "ATU 31367703",
  },
  {
    name: "RA DI (FH) Mag. Bernd Auer",
    advm: "R808398",
  },
  {
    name: "RA Mag. Anna Girardi",
    advm: "R818867",
  },
];

export function ImpressumPage() {
  const { content } = useStoryblok('pages/impressum');
  const c = content as any;

  // Build RA list from Storyblok or fallback
  const raList = [];
  for (let i = 1; i <= 3; i++) {
    const name = c?.[`ra_${i}_name`];
    if (name) raList.push({ name, advm: c[`ra_${i}_advm`] || "", uid: c[`ra_${i}_uid`] || "" });
  }
  const raData = raList.length > 0 ? raList : rechtsanwaelte;

  // Build vorschriften from Storyblok or fallback
  const vorschriften = [
    c?.vorschrift_1 || "Rechtsanwaltsordnung (RAO)",
    c?.vorschrift_2 || "Allgemeine Bedingungen für Rechtsanwälte",
    c?.vorschrift_3 || "Standesregeln der Rechtsanwälte",
    c?.vorschrift_4 || "Disziplinarstatut der Rechtsanwaltskammern",
  ].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{c?.seo_title || "Impressum | Rechtsanwaltskanzlei Girardi & Auer Innsbruck"}</title>
        <meta
          name="description"
          content={c?.seo_description || "Impressum der Rechtsanwaltskanzlei Girardi & Auer, Stainerstraße 2, 6020 Innsbruck."}
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.girardi-auer.com/impressum" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto text-center">
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl mb-6 leading-tight">
              {c?.hero_title || "Impressum"}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-slate-300">
              {c?.hero_subtitle || "GIRARDI & AUER · Rechtsanwälte in Regiegemeinschaft"}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-12"
          >
            {/* Contact Card */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-10 border border-slate-200"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a365d]/5 rounded-full mb-4">
                  <Building className="w-4 h-4 text-[#1a365d]" />
                  <span className="text-sm text-[#1a365d]">Kanzlei</span>
                </div>
                <h2 className="text-2xl text-slate-900">
                  {c?.kanzlei_name || "Girardi & Auer"}
                </h2>
                <p className="text-slate-500">{c?.kanzlei_desc || "Rechtsanwälte in Regiegemeinschaft"}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#1a365d] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    {c?.address_line1 || "Stainerstraße 2"}<br />
                    {c?.address_line2 || "6020 Innsbruck"}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#1a365d] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    <a href={`tel:${(c?.phone || "+43 (0)512 / 57 40 95").replace(/[\s\/()]/g, "")}`} className="hover:text-[#1a365d] transition-colors">{c?.phone || "+43 (0)512 / 57 40 95"}</a><br />
                    Fax: {c?.fax || "+43 (0)512 / 57 40 97"}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#1a365d] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-700">
                    <a href={`mailto:${c?.email || "info@girardi-auer.com"}`} className="text-[#1a365d] hover:underline">{c?.email || "info@girardi-auer.com"}</a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rechtsanwälte */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl text-slate-900 mb-6 text-center">Rechtsanwälte</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {raData.map((ra) => (
                  <div key={ra.name} className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all">
                    <div className="w-10 h-10 bg-[#1a365d]/5 rounded-lg flex items-center justify-center mb-4">
                      <Scale className="w-5 h-5 text-[#1a365d]" />
                    </div>
                    <h3 className="text-slate-900 mb-2">{ra.name}</h3>
                    <p className="text-sm text-slate-500">ADVM: {ra.advm}</p>
                    {ra.uid && <p className="text-sm text-slate-500">UID: {ra.uid}</p>}
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="border-t border-slate-100"></div>

            {/* Berufsrechtliche Angaben */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl text-slate-900 mb-6 text-center">Berufsrechtliche Angaben</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="text-sm text-slate-500 uppercase tracking-widest mb-3">Berufsbezeichnung</h3>
                  <p className="text-slate-700">{c?.berufsbezeichnung || "Rechtsanwalt (verliehen in Österreich)"}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="text-sm text-slate-500 uppercase tracking-widest mb-3">Kammer</h3>
                  <p className="text-slate-700 mb-1">{c?.kammer_name || "Rechtsanwaltskammer für Tirol"}</p>
                  <p className="text-sm text-slate-500">{c?.kammer_address || "Meraner Straße 3, 6020 Innsbruck"}</p>
                  <a
                    href={c?.kammer_url || "https://www.rechtsanwaelte-tirol.at"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#1a365d] hover:underline mt-2"
                  >
                    {c?.kammer_url ? c?.kammer_url.replace("https://", "") : "rechtsanwaelte-tirol.at"} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="md:col-span-2 bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="text-sm text-slate-500 uppercase tracking-widest mb-3">Berufsrechtliche Vorschriften</h3>
                  <div className="flex flex-wrap gap-2">
                    {vorschriften.map((item) => (
                      <span key={item} className="px-3 py-1.5 bg-white text-slate-700 text-sm rounded-lg border border-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-4">
                    Einsehbar unter{" "}
                    <a href={c?.vorschriften_url || "https://www.rechtsanwaelte.at"} target="_blank" rel="noopener noreferrer" className="text-[#1a365d] hover:underline">
                      {(c?.vorschriften_url || "www.rechtsanwaelte.at").replace("https://", "")}
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="border-t border-slate-100"></div>

            {/* Haftung */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl text-slate-900 mb-6 text-center">Haftungsausschluss</h2>
              <div className="space-y-8 text-slate-700 leading-relaxed">
                <div>
                  <h3 className="text-lg text-slate-900 mb-2">{c?.haftung_inhalte_title || "Haftung für Inhalte"}</h3>
                  <p>
                    {c?.haftung_inhalte_text || "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg text-slate-900 mb-2">{c?.haftung_links_title || "Haftung für Links"}</h3>
                  <p>
                    {c?.haftung_links_text || "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg text-slate-900 mb-2">{c?.urheberrecht_title || "Urheberrecht"}</h3>
                  <p>
                    {c?.urheberrecht_text || "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}