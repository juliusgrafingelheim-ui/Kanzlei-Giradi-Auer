import { Link } from "react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { LogoWhite } from "./LogoWhite";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <LogoWhite className="h-10 w-auto" />
              <div>
                <div className="font-bold text-xl tracking-tight">Girardi & Auer</div>
                <div className="text-sm text-slate-400">Rechtsanwälte · Innsbruck</div>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md mb-6">
              Professionelle Rechtsberatung mit persönlicher Note seit 1989. 
              Wir betreuen Privatpersonen und Unternehmen in allen rechtlichen Belangen.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <div className="space-y-3">
              <Link
                to="/"
                className="block text-slate-400 hover:text-white transition-colors"
              >
                Start
              </Link>
              <Link
                to="/ueber-uns"
                className="block text-slate-400 hover:text-white transition-colors"
              >
                Über uns
              </Link>
              <Link
                to="/rechtsgebiete"
                className="block text-slate-400 hover:text-white transition-colors"
              >
                Rechtsgebiete
              </Link>
              <Link
                to="/kontakt"
                className="block text-slate-400 hover:text-white transition-colors"
              >
                Kontakt
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Kontakt</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                <div className="text-slate-400">
                  Stainerstraße 2<br />
                  6020 Innsbruck
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a href="tel:+43512574095" className="text-slate-400 hover:text-white transition-colors">
                  +43 512 574095
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <a href="mailto:info@girardi-auer.com" className="text-slate-400 hover:text-white transition-colors">
                  info@girardi-auer.com
                </a>
              </div>
              <div className="flex items-start gap-3 pt-2">
                <Clock className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                <div className="text-slate-400">
                  Mo - Fr: 08:00 - 12:00<br />
                  Mo - Do: 14:00 - 16:30
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Rechtsanwaltskanzlei Girardi & Auer. Alle Rechte vorbehalten.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/impressum"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Impressum
              </Link>
              <Link
                to="/datenschutz"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}