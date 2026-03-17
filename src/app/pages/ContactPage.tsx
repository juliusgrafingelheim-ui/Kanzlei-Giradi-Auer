import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, Clock, ArrowRight, Send } from "lucide-react";

export function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Kontakt - Rechtsberatung in Innsbruck | Girardi & Auer</title>
        <meta
          name="description"
          content="Kontaktieren Sie Rechtsanwaltskanzlei Girardi & Auer ➤ Stainerstraße 2, 6020 Innsbruck ☎ +43 512 574095 ✉ info@girardi-auer.com ✓ Jetzt Termin vereinbaren!"
        />
        <meta name="keywords" content="Rechtsanwalt Kontakt Innsbruck, Anwalt Termin Innsbruck, Kanzlei Girardi Auer Kontakt" />
        <link rel="canonical" href="https://www.girardi-auer.com/kontakt" />
        <meta property="og:title" content="Kontakt | Rechtsanwaltskanzlei Girardi & Auer" />
        <meta property="og:description" content="Vereinbaren Sie einen Termin bei unserer Kanzlei in Innsbruck. Wir freuen uns auf Ihre Nachricht!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.girardi-auer.com/kontakt" />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
              <Mail className="w-4 h-4 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Kontakt</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Lassen Sie uns sprechen
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persönlich. 
              Vereinbaren Sie noch heute einen Termin.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Nachricht senden
              </h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all"
                      placeholder="ihre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all"
                    placeholder="+43 ..."
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Betreff
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all"
                    placeholder="Betreff Ihrer Anfrage"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d] focus:border-transparent transition-all resize-none"
                    placeholder="Ihre Nachricht"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center gap-2 bg-[#1a365d] text-white px-8 py-4 rounded-xl hover:bg-[#152d4d] transition-all font-medium shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30"
                >
                  Nachricht senden
                  <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                  Kontaktinformationen
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Adresse</h3>
                      <p className="text-slate-600">
                        Stainerstraße 2<br />
                        6020 Innsbruck<br />
                        Österreich
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Phone className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Telefon</h3>
                      <p className="text-slate-600">
                        <a href="tel:+43512574095" className="hover:text-[#1a365d] transition-colors">
                          +43 512 574095
                        </a>
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Fax: +43 512 574097
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Mail className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">E-Mail</h3>
                      <p className="text-slate-600">
                        <a href="mailto:info@girardi-auer.com" className="hover:text-[#1a365d] transition-colors">
                          info@girardi-auer.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Öffnungszeiten</h3>
                      <div className="text-slate-600 space-y-1">
                        <p>Mo - Fr: 08:00 - 12:00 Uhr</p>
                        <p>Mo - Do: 14:00 - 16:30 Uhr</p>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">
                        Termine außerhalb der Öffnungszeiten nach Vereinbarung
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Unser Standort
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Zentral gelegen im Herzen von Innsbruck – gut erreichbar mit öffentlichen Verkehrsmitteln und dem Auto
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
              title="Kanzlei Girardi & Auer Standort"
            ></iframe>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Parkmöglichkeiten finden Sie in den umliegenden Parkhäusern. 
              Die Kanzlei ist auch mit öffentlichen Verkehrsmitteln gut erreichbar.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1a365d] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Bereit für ein persönliches Gespräch?
          </h2>
          <p className="text-xl text-slate-200 mb-8 leading-relaxed">
            Vereinbaren Sie noch heute einen Termin und lassen Sie uns gemeinsam 
            die beste Lösung für Ihr rechtliches Anliegen finden.
          </p>
          <a
            href="tel:+43512574095"
            className="inline-flex items-center gap-2 bg-white text-[#1a365d] px-8 py-4 rounded-xl hover:bg-slate-100 transition-all font-medium shadow-xl"
          >
            Jetzt anrufen: +43 512 574095
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
}