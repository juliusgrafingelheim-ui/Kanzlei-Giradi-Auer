import { useState, useEffect } from "react";
import { X, Cookie, Shield } from "lucide-react";
import { Link } from "react-router";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Small delay to show banner after page load
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    closeBanner();
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    closeBanner();
  };

  const closeBanner = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isClosing ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="bg-white border-t border-slate-200 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Icon & Text */}
            <div className="flex-1 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-[#1a365d] rounded-xl flex items-center justify-center">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Cookies & Datenschutz
                  </h3>
                  <Shield className="w-4 h-4 text-[#1a365d]" />
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Wir verwenden Cookies, um Ihnen ein optimales Nutzererlebnis zu bieten. Einige Cookies sind für den Betrieb der Website technisch notwendig. Durch Klicken auf „Alle akzeptieren" stimmen Sie der Verwendung aller Cookies zu. In unserer{" "}
                  <Link 
                    to="/datenschutz" 
                    className="text-[#1a365d] hover:underline font-medium"
                  >
                    Datenschutzerklärung
                  </Link>
                  {" "}erfahren Sie mehr über die Verarbeitung Ihrer Daten.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-all font-medium text-sm whitespace-nowrap"
              >
                Nur notwendige
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-[#1a365d] text-white rounded-xl hover:bg-[#152d4d] transition-all font-medium text-sm whitespace-nowrap shadow-lg"
              >
                Alle akzeptieren
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={closeBanner}
              className="absolute top-4 right-4 md:relative md:top-0 md:right-0 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Banner schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
