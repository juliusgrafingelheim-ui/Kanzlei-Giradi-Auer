import { Helmet } from "react-helmet-async";
import { Shield, Lock, Eye, Database, Globe } from "lucide-react";

export function DatenschutzPage() {
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
      <section className="pt-32 pb-16 bg-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">DSGVO-konform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Datenschutzerklärung
            </h1>
            <p className="text-xl text-slate-200">
              Informationen zur Verarbeitung personenbezogener Daten
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            {/* Einleitung */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1a365d] rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 m-0">
                  Datenschutz
                </h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed">
                Der Schutz Ihrer personenbezogenen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In dieser Datenschutzerklärung informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.
              </p>
            </div>

            {/* Verantwortlicher */}
            <div className="mb-16 p-8 bg-slate-50 rounded-2xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Verantwortlicher
              </h2>
              <div className="text-slate-700 space-y-2">
                <p className="font-semibold text-slate-900">Rechtsanwaltskanzlei Girardi & Auer</p>
                <p>Stainerstraße 2</p>
                <p>6020 Innsbruck, Österreich</p>
                <p>Tel.: +43 (0)512 / 57 40 95</p>
                <p>Email: <a href="mailto:info@girardi-auer.com" className="text-[#1a365d] hover:underline">info@girardi-auer.com</a></p>
              </div>
            </div>

            {/* Cookies */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1a365d] rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 m-0">
                  Cookies
                </h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Unsere Website verwendet sogenannte „Cookies". Dabei handelt es sich um kleine Textdateien, die mit Hilfe des Browsers auf Ihrem Endgerät abgelegt werden. Sie richten keinen Schaden an.
              </p>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Wir nutzen Cookies dazu, unser Angebot nutzerfreundlich zu gestalten. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. Sie ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
              </p>
              
              <p className="text-slate-700 leading-relaxed">
                Wenn Sie dies nicht wünschen, so können Sie Ihren Browser so einrichten, dass er Sie über das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben. Bei der Deaktivierung von Cookies kann die Funktionalität unserer Website eingeschränkt sein.
              </p>
            </div>

            {/* Google Maps */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1a365d] rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 m-0">
                  Google Maps
                </h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Diese Website nutzt über eine API den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited („Google"), Gordon House, Barrow Street, Dublin 4, Irland.
              </p>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Der Anbieter dieser Seite hat keinen Einfluss auf diese Datenübertragung.
              </p>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Die Nutzung von Google Maps erfolgt im Interesse einer ansprechenden Darstellung unserer Online-Angebote und an einer leichten Auffindbarkeit der von uns auf der Website angegebenen Orte. Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
              </p>
              
              <p className="text-slate-700 leading-relaxed">
                Mehr Informationen zum Umgang mit Nutzerdaten finden Sie in der Datenschutzerklärung von Google:{" "}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1a365d] hover:underline"
                >
                  https://policies.google.com/privacy
                </a>
              </p>
            </div>

            {/* Kontaktformular */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Kontaktaufnahme
              </h2>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen sechs Monate bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
              </p>
            </div>

            {/* Server-Log-Dateien */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Server-Log-Dateien
              </h2>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4">
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse</li>
              </ul>
              
              <p className="text-slate-700 leading-relaxed">
                Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Websitebetreiber hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.
              </p>
            </div>

            {/* Ihre Rechte */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#1a365d] rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 m-0">
                  Ihre Rechte
                </h2>
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-4">
                Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die Datenschutzbehörde.
              </p>
              
              <div className="p-6 bg-slate-50 rounded-xl space-y-2">
                <p className="font-semibold text-slate-900">Österreichische Datenschutzbehörde</p>
                <p className="text-slate-700">Barichgasse 40-42</p>
                <p className="text-slate-700">1030 Wien</p>
                <p className="text-slate-700">
                  Tel.: +43 1 52 152-0<br />
                  <a 
                    href="https://www.dsb.gv.at" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1a365d] hover:underline"
                  >
                    www.dsb.gv.at
                  </a>
                </p>
              </div>
            </div>

            {/* SSL/TLS-Verschlüsselung */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                SSL- bzw. TLS-Verschlüsselung
              </h2>
              
              <p className="text-slate-700 leading-relaxed">
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
              </p>
            </div>

            {/* Speicherdauer */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Speicherdauer
              </h2>
              
              <p className="text-slate-700 leading-relaxed">
                Wir speichern personenbezogene Daten nur so lange, wie dies für die Erfüllung des jeweiligen Zwecks erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorsehen. Nach Wegfall des jeweiligen Zwecks bzw. Ablauf der Fristen werden die entsprechenden Daten routinemäßig gelöscht.
              </p>
            </div>

            {/* Weitergabe von Daten */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Weitergabe von Daten an Dritte
              </h2>
              
              <p className="text-slate-700 leading-relaxed">
                Eine Übermittlung Ihrer persönlichen Daten an Dritte zu anderen als den im Folgenden aufgeführten Zwecken findet nicht statt. Wir geben Ihre persönlichen Daten nur an Dritte weiter, wenn:
              </p>
              
              <ul className="list-disc list-inside space-y-2 text-slate-700">
                <li>Sie Ihre nach Art. 6 Abs. 1 S. 1 lit. a DSGVO ausdrückliche Einwilligung dazu erteilt haben</li>
                <li>die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. f DSGVO zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist und kein Grund zur Annahme besteht, dass Sie ein überwiegendes schutzwürdiges Interesse an der Nichtweitergabe Ihrer Daten haben</li>
                <li>für den Fall, dass für die Weitergabe nach Art. 6 Abs. 1 S. 1 lit. c DSGVO eine gesetzliche Verpflichtung besteht</li>
                <li>dies gesetzlich zulässig und nach Art. 6 Abs. 1 S. 1 lit. b DSGVO für die Abwicklung von Vertragsverhältnissen mit Ihnen erforderlich ist</li>
              </ul>
            </div>

            {/* Schlussbestimmung */}
            <div className="p-8 bg-slate-100 rounded-2xl">
              <p className="text-slate-700 leading-relaxed text-sm">
                <strong className="text-slate-900">Stand dieser Datenschutzerklärung:</strong> März 2026
                <br /><br />
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}