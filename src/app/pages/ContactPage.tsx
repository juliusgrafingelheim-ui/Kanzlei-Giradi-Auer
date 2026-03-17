import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, Clock, ArrowRight, Send, Shield, CheckCircle2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useStoryblok } from "../../hooks/useStoryblok";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function ContactPage() {
  const { content } = useStoryblok('pages/contact');
  const c = content as any;

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    rechtsgebiet: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Fehler beim Senden");
      }

      setFormSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", rechtsgebiet: "" });
    } catch (err: any) {
      setSubmitError(err.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build rechtsgebiet options from Storyblok or fallback
  const rechtsgebietStr = c?.rechtsgebiet_options || "Liegenschaftsrecht,Vergaberecht,Schadenersatzrecht,Ehe- und Scheidungsrecht,Erbrecht,Erwachsenenschutz,Unternehmensgründung,Inkassowesen,Rechtsgutachten,Sonstiges";
  const rechtsgebietOptions = rechtsgebietStr.split(",").map((s: string) => s.trim());

  // Trust items from Storyblok or fallback
  const trustItems = [
    c?.trust_1 || "Unverbindliches Erstgespräch",
    c?.trust_2 || "Vertrauliche Beratung",
    c?.trust_3 || "Antwort innerhalb 24h",
    c?.trust_4 || "35+ Jahre Erfahrung",
  ];

  return (
    <>
      <Helmet>
        <title>{c?.seo_title || "Kontakt - Rechtsberatung in Innsbruck | Girardi & Auer"}</title>
        <meta
          name="description"
          content={c?.seo_description || "Kontaktieren Sie Rechtsanwaltskanzlei Girardi & Auer."}
        />
        <meta name="keywords" content="Rechtsanwalt Kontakt Innsbruck, Anwalt Termin Innsbruck" />
        <link rel="canonical" href="https://www.girardi-auer.com/kontakt" />
        <meta property="og:title" content="Kontakt | Rechtsanwaltskanzlei Girardi & Auer" />
        <meta property="og:description" content="Vereinbaren Sie einen Termin bei unserer Kanzlei in Innsbruck." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.girardi-auer.com/kontakt" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d] via-slate-900 to-slate-950"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a365d]/20 rounded-full blur-[128px] -translate-y-1/3 translate-x-1/4"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full mb-8">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{c?.hero_badge || "Kontakt aufnehmen"}</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.1] tracking-tight">
              {c?.hero_title_line1 || "Lassen Sie uns"}<br />
              <span className="text-slate-400">{c?.hero_title_line2 || "sprechen"}</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-slate-300 leading-relaxed max-w-lg">
              {c?.hero_description || "Wir freuen uns auf Ihre Anfrage und beraten Sie gerne persönlich. Vereinbaren Sie noch heute einen Termin für ein unverbindliches Erstgespräch."}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="relative -mt-8 z-10 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid sm:grid-cols-3 gap-4"
          >
            <motion.a
              variants={fadeInUp}
              href={`tel:${(c?.quick_phone || "+43 512 574095").replace(/\s/g, "")}`}
              className="group bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-[#1a365d]/20 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1a365d]/5 rounded-xl flex items-center justify-center group-hover:bg-[#1a365d]/10 transition-colors">
                  <Phone className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">{c?.quick_phone_label || "Telefon"}</div>
                  <div className="text-slate-900">{c?.quick_phone || "+43 512 574095"}</div>
                </div>
              </div>
            </motion.a>

            <motion.a
              variants={fadeInUp}
              href={`mailto:${c?.quick_email || "info@girardi-auer.com"}`}
              className="group bg-white rounded-2xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-[#1a365d]/20 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1a365d]/5 rounded-xl flex items-center justify-center group-hover:bg-[#1a365d]/10 transition-colors">
                  <Mail className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">{c?.quick_email_label || "E-Mail"}</div>
                  <div className="text-slate-900">{c?.quick_email || "info@girardi-auer.com"}</div>
                </div>
              </div>
            </motion.a>

            <motion.div
              variants={fadeInUp}
              className="group bg-white rounded-2xl p-6 shadow-xl border border-slate-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1a365d]/5 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-[#1a365d]" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">{c?.quick_address_label || "Adresse"}</div>
                  <div className="text-slate-900">{c?.quick_address || "Stainerstraße 2, Innsbruck"}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content: Form + Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Contact Form - wider */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-3"
            >
              <motion.div variants={fadeInUp} className="mb-8">
                <h2 className="text-2xl text-slate-900 mb-2">
                  {c?.form_title || "Nachricht senden"}
                </h2>
                <p className="text-slate-500">{c?.form_subtitle || "Wir antworten in der Regel innerhalb von 24 Stunden."}</p>
              </motion.div>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl text-slate-900 mb-2">{c?.form_success_title || "Vielen Dank!"}</h3>
                  <p className="text-slate-600 max-w-sm mx-auto">
                    {c?.form_success_text || "Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen."}
                  </p>
                </motion.div>
              ) : (
                <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm text-slate-700 mb-2">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d]/30 focus:border-[#1a365d] transition-all outline-none"
                        placeholder="Ihr Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm text-slate-700 mb-2">
                        E-Mail <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d]/30 focus:border-[#1a365d] transition-all outline-none"
                        placeholder="ihre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm text-slate-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d]/30 focus:border-[#1a365d] transition-all outline-none"
                        placeholder="+43 ..."
                      />
                    </div>
                    <div>
                      <label htmlFor="rechtsgebiet" className="block text-sm text-slate-700 mb-2">
                        Rechtsgebiet
                      </label>
                      <select
                        id="rechtsgebiet"
                        value={formData.rechtsgebiet}
                        onChange={(e) => setFormData({ ...formData, rechtsgebiet: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d]/30 focus:border-[#1a365d] transition-all outline-none appearance-none"
                      >
                        <option value="">Bitte wählen...</option>
                        {rechtsgebietOptions.map((opt: string) => (
                          <option key={opt} value={opt.toLowerCase().replace(/\s+/g, "-")}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm text-slate-700 mb-2">
                      Betreff
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d]/30 focus:border-[#1a365d] transition-all outline-none"
                      placeholder="Betreff Ihrer Anfrage"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm text-slate-700 mb-2">
                      Nachricht <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#1a365d]/30 focus:border-[#1a365d] transition-all resize-none outline-none"
                      placeholder="Beschreiben Sie Ihr Anliegen..."
                    ></textarea>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group inline-flex items-center justify-center gap-2 bg-[#1a365d] text-white px-8 py-4 rounded-xl hover:bg-[#152d4d] transition-all shadow-lg shadow-[#1a365d]/20 hover:shadow-xl hover:shadow-[#1a365d]/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
                      <Send className={`h-5 w-5 transition-transform ${isSubmitting ? "animate-pulse" : "group-hover:translate-x-1"}`} />
                    </button>
                    <p className="text-xs text-slate-400 max-w-xs">
                      Mit dem Absenden stimmen Sie unserer{" "}
                      <a href="/datenschutz" className="text-[#1a365d] hover:underline">Datenschutzerklärung</a> zu.
                    </p>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}
                </motion.form>
              )}
            </motion.div>

            {/* Sidebar Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-2 space-y-6"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-2xl text-slate-900 mb-6">
                  Informationen
                </h2>
              </motion.div>

              {/* Opening Hours */}
              <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-[#1a365d]" />
                  <h3 className="text-slate-900">{c?.hours_title || "Öffnungszeiten"}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{c?.hours_1_days || "Mo - Fr"}</span>
                    <span className="text-slate-900">{c?.hours_1_time || "08:00 - 12:00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{c?.hours_2_days || "Mo - Do"}</span>
                    <span className="text-slate-900">{c?.hours_2_time || "14:00 - 16:30"}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-slate-500 text-xs">
                      {c?.hours_note || "Termine außerhalb der Öffnungszeiten nach Vereinbarung"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Contact Details */}
              <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-[#1a365d]" />
                  <h3 className="text-slate-900">{c?.contact_title || "Direkt erreichen"}</h3>
                </div>
                <div className="space-y-3">
                  <a href={`tel:${(c?.contact_phone || "+43 512 574095").replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-[#1a365d] transition-colors">
                    <span>Tel: {c?.contact_phone || "+43 512 574095"}</span>
                  </a>
                  <p className="text-sm text-slate-500">Fax: {c?.contact_fax || "+43 512 574097"}</p>
                  <a href={`mailto:${c?.contact_email || "info@girardi-auer.com"}`} className="flex items-center gap-3 text-sm text-slate-700 hover:text-[#1a365d] transition-colors">
                    <span>{c?.contact_email || "info@girardi-auer.com"}</span>
                  </a>
                </div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div variants={fadeInUp} className="bg-[#1a365d] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-5">
                  <Shield className="w-5 h-5 text-white/70 flex-shrink-0" />
                  <h3 className="text-white">{c?.trust_title || "Ihre Vorteile"}</h3>
                </div>
                <ul className="space-y-3.5">
                  {trustItems.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Address */}
              <motion.div variants={fadeInUp} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#1a365d]" />
                  <h3 className="text-slate-900">{c?.address_title || "Adresse"}</h3>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {c?.address_line1 || "Stainerstraße 2"}<br />
                  {c?.address_line2 || "6020 Innsbruck"}<br />
                  {c?.address_country || "Österreich"}
                </p>
                <p className="text-xs text-slate-500">
                  {c?.address_note || "Parkmöglichkeiten in umliegenden Parkhäusern. Gut erreichbar mit öffentlichen Verkehrsmitteln."}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section - Full Width */}
      <section className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl text-slate-900 mb-4">
              {c?.map_title || "Unser Standort"}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-slate-600 max-w-2xl mx-auto">
              {c?.map_subtitle || "Zentral im Herzen von Innsbruck"}
            </motion.p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-[450px] lg:h-[500px]"
        >
          <iframe
            src={c?.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2712.0!2d11.3894847!3d47.2666717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479d6bfb1e33fb15%3A0x1d6776d64f3b4acb!2sDr.%20Thomas%20Girardi!5e0!3m2!1sde!2sat!4v1710000000000!5m2!1sde!2sat"}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kanzlei Girardi & Auer Standort"
          ></iframe>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#1a365d] to-slate-900 rounded-3xl p-12 lg:p-16 text-white overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl mb-4">
                {c?.cta_title || "Bereit für ein persönliches Gespräch?"}
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                {c?.cta_description || "Rufen Sie uns direkt an oder schreiben Sie uns – wir freuen uns darauf, Ihnen zu helfen."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+43512574095"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#1a365d] px-8 py-4 rounded-xl hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-0.5"
                >
                  <Phone className="w-5 h-5" />
                  Jetzt anrufen
                </a>
                <a
                  href="mailto:info@girardi-auer.com"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
                >
                  <Mail className="w-5 h-5" />
                  E-Mail senden
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}