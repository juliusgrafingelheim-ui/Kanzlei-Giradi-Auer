import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { Home, ArrowLeft, Scale } from "lucide-react";
import { motion } from "motion/react";

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Seite nicht gefunden | Rechtsanwaltskanzlei Girardi & Auer</title>
      </Helmet>

      <section className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#1a365d]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-slate-200/50 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl mx-auto px-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a365d]/5 rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-[#1a365d]" />
          </div>
          <div className="text-8xl text-[#1a365d]/20 mb-4">404</div>
          <h1 className="text-3xl sm:text-4xl text-slate-900 mb-4">
            Seite nicht gefunden
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto">
            Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-[#1a365d] text-white px-8 py-4 rounded-xl hover:bg-[#152d4d] transition-all shadow-lg shadow-[#1a365d]/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Home className="h-5 w-5" />
              Zur Startseite
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
              Zurück
            </button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
