import { Helmet } from "react-helmet-async";
import { Shield, Lock, Eye, Database, Globe, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useStoryblok } from "../../hooks/useStoryblok";

const SSL_FALLBACK = "Diese Seite nutzt aus Sicherheitsgr\u00FCnden und zum Schutz der \u00DCbertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschl\u00FCsselung. Eine verschl\u00FCsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von \u201Ehttp://\u201C auf \u201Ehttps://\u201C wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const sections = [
  { id: "datenschutz", label: "Datenschutz" },
  { id: "verantwortlicher", label: "Verantwortlicher" },
  { id: "cookies", label: "Cookies" },
  { id: "google-maps", label: "Google Maps" },
  { id: "kontaktaufnahme", label: "Kontaktaufnahme" },
  { id: "server-logs", label: "Server-Log-Dateien" },
  { id: "ihre-rechte", label: "Ihre Rechte" },
  { id: "ssl", label: "SSL/TLS-Verschlüsselung" },
  { id: "speicherdauer", label: "Speicherdauer" },
  { id: "weitergabe", label: "Weitergabe an Dritte" },
];

export function DatenschutzPage() {
  const { content } = useStoryblok('pages/datenschutz');
  const c = content as any;

  const [activeSection, setActiveSection] = useState("datenschutz");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung | Rechtsanwaltskanzlei Girardi & Auer</title>
        <meta
          name="description"
          content="Datenschutzerklärung der Rechtsanwaltskanzlei Girardi & Auer. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://www.girardi-auer.com/datenschutz" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/2 translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl mx-auto text-center">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm">{c?.hero_badge || "DSGVO-konform"}</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl mb-6 leading-tight">
              {c?.hero_title || "Datenschutzerklärung"}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-slate-300">
              {c?.hero_subtitle || "Informationen zur Verarbeitung personenbezogener Daten"}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content with Sidebar TOC */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Sticky TOC */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <h3 className="text-sm text-slate-500 uppercase tracking-widest mb-4">Inhaltsverzeichnis</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                        activeSection === section.id
                          ? "bg-[#1a365d]/5 text-[#1a365d]"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${
                        activeSection === section.id ? "rotate-90" : ""
                      }`} />
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-16">
              {/* Datenschutz */}
              <div id="datenschutz" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#1a365d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl text-slate-900">Datenschutz</h2>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {c?.datenschutz_text || "Der Schutz Ihrer personenbezogenen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website."}
                </p>
              </div>

              {/* Verantwortlicher */}
              <div id="verantwortlicher" className="scroll-mt-28">
                <h2 className="text-2xl text-slate-900 mb-4">Verantwortlicher</h2>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <div className="text-slate-700 space-y-1">
                    <p className="text-slate-900">{c?.verantwortlicher_name || "Rechtsanwaltskanzlei Girardi & Auer"}</p>
                    <p>{c?.verantwortlicher_address1 || "Stainerstraße 2"}</p>
                    <p>{c?.verantwortlicher_address2 || "6020 Innsbruck, Österreich"}</p>
                    <p>Tel.: {c?.verantwortlicher_phone || "+43 (0)512 / 57 40 95"}</p>
                    <p>Email: <a href={`mailto:${c?.verantwortlicher_email || "info@girardi-auer.com"}`} className="text-[#1a365d] hover:underline">{c?.verantwortlicher_email || "info@girardi-auer.com"}</a></p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div id="cookies" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#1a365d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl text-slate-900">Cookies</h2>
                </div>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>{c?.cookies_text_1 || "Unsere Website verwendet sogenannte Cookies. Dabei handelt es sich um kleine Textdateien, die mit Hilfe des Browsers auf Ihrem Endgerät abgelegt werden. Sie richten keinen Schaden an."}</p>
                  <p>{c?.cookies_text_2 || "Wir nutzen Cookies dazu, unser Angebot nutzerfreundlich zu gestalten. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen."}</p>
                  <p>{c?.cookies_text_3 || "Wenn Sie dies nicht wünschen, so können Sie Ihren Browser so einrichten, dass er Sie über das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben. Bei der Deaktivierung von Cookies kann die Funktionalität unserer Website eingeschränkt sein."}</p>
                </div>
              </div>

              {/* Google Maps */}
              <div id="google-maps" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#1a365d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl text-slate-900">Google Maps</h2>
                </div>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  <p>{c?.google_maps_text_1 || "Diese Website nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland."}</p>
                  <p>{c?.google_maps_text_2 || "Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert."}</p>
                  <p>{c?.google_maps_text_3 || "Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar."}</p>
                  <p>Mehr Informationen zum Umgang mit Nutzerdaten: <a href={c?.google_maps_link || "https://policies.google.com/privacy"} target="_blank" rel="noopener noreferrer" className="text-[#1a365d] hover:underline">{c?.google_maps_link || "policies.google.com/privacy"}</a></p>
                </div>
              </div>

              {/* Kontaktaufnahme */}
              <div id="kontaktaufnahme" className="scroll-mt-28">
                <h2 className="text-2xl text-slate-900 mb-4">Kontaktaufnahme</h2>
                <p className="text-slate-700 leading-relaxed">
                  {c?.kontaktaufnahme_text || "Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen sechs Monate bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter."}
                </p>
              </div>

              {/* Server-Log-Dateien */}
              <div id="server-logs" className="scroll-mt-28">
                <h2 className="text-2xl text-slate-900 mb-4">Server-Log-Dateien</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {c?.server_logs_intro || "Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt:"}
                </p>
                <ul className="space-y-2 mb-4">
                  {[c?.server_log_1 || "Browsertyp und Browserversion", c?.server_log_2 || "Verwendetes Betriebssystem", c?.server_log_3 || "Referrer URL", c?.server_log_4 || "Hostname des zugreifenden Rechners", c?.server_log_5 || "Uhrzeit der Serveranfrage", c?.server_log_6 || "IP-Adresse"].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 bg-[#1a365d] rounded-full mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  {c?.server_logs_outro || "Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO."}
                </p>
              </div>

              {/* Ihre Rechte */}
              <div id="ihre-rechte" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#1a365d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl text-slate-900">Ihre Rechte</h2>
                </div>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {c?.rechte_text || "Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich bei der Aufsichtsbehörde beschweren."}
                </p>
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-1 text-sm text-slate-700">
                  <p className="text-slate-900">{c?.rechte_behoerde_name || "Österreichische Datenschutzbehörde"}</p>
                  <p>{c?.rechte_behoerde_address || "Barichgasse 40-42, 1030 Wien"}</p>
                  <p>Tel.: {c?.rechte_behoerde_phone || "+43 1 52 152-0"}</p>
                  <a href={c?.rechte_behoerde_url || "https://www.dsb.gv.at"} target="_blank" rel="noopener noreferrer" className="text-[#1a365d] hover:underline">{c?.rechte_behoerde_url || "www.dsb.gv.at"}</a>
                </div>
              </div>

              {/* SSL */}
              <div id="ssl" className="scroll-mt-28">
                <h2 className="text-2xl text-slate-900 mb-4">SSL- bzw. TLS-Verschl&uuml;sselung</h2>
                <p className="text-slate-700 leading-relaxed">
                  {c?.ssl_text || SSL_FALLBACK}
                </p>
              </div>

              {/* Speicherdauer */}
              <div id="speicherdauer" className="scroll-mt-28">
                <h2 className="text-2xl text-slate-900 mb-4">Speicherdauer</h2>
                <p className="text-slate-700 leading-relaxed">
                  {c?.speicherdauer_text || "Wir speichern personenbezogene Daten nur so lange, wie dies für die Erfüllung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorsehen. Nach Wegfall des jeweiligen Zwecks bzw. Ablauf der Fristen werden die entsprechenden Daten routinemäßig gelöscht."}
                </p>
              </div>

              {/* Weitergabe */}
              <div id="weitergabe" className="scroll-mt-28">
                <h2 className="text-2xl text-slate-900 mb-4">Weitergabe von Daten an Dritte</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {c?.weitergabe_intro || "Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:"}
                </p>
                <ul className="space-y-3">
                  {[c?.weitergabe_1, c?.weitergabe_2, c?.weitergabe_3, c?.weitergabe_4].filter(Boolean).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 bg-[#1a365d] rounded-full mt-2 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Note */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                <p className="text-slate-600 text-sm leading-relaxed">
                  <span className="text-slate-900">Stand dieser Datenschutzerklärung:</span> {c?.footer_stand || "März 2026"}
                  <br /><br />
                  {c?.footer_text || "Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}