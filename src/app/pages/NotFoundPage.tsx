import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Seite nicht gefunden | Rechtsanwaltskanzlei Girardi & Auer</title>
      </Helmet>

      <section className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-amber-600 text-8xl font-bold mb-6">404</div>
          <h1 className="font-serif text-4xl font-bold text-slate-900 mb-4">
            Seite nicht gefunden
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              Zur Startseite
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Zurück
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
