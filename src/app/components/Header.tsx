import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const navigation = [
  { name: "Start", href: "/" },
  { name: "Über uns", href: "/ueber-uns" },
  { name: "Rechtsgebiete", href: "/rechtsgebiete" },
  { name: "Kontakt", href: "/kontakt" },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <Logo 
              className="h-12 w-auto group-hover:opacity-80 transition-opacity"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-slate-900 text-lg">Girardi & Auer</div>
              <div className="text-xs text-slate-500">Rechtsanwälte</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-slate-100 text-[#1a365d]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <Link
            to="/kontakt"
            className="hidden md:inline-flex items-center gap-2 bg-[#1a365d] text-white px-6 py-2.5 rounded-xl hover:bg-[#152d4d] transition-all text-sm font-medium shadow-sm"
          >
            Termin vereinbaren
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-6 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    block px-4 py-3 rounded-lg text-base font-medium transition-all
                    ${
                      isActive
                        ? "bg-slate-100 text-[#1a365d]"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/kontakt"
              className="block text-center bg-[#1a365d] text-white px-4 py-3 rounded-xl hover:bg-[#152d4d] transition-all text-base font-medium mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Termin vereinbaren
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}