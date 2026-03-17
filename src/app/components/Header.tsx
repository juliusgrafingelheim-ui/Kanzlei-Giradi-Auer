import { Link, useLocation } from "react-router";
import { Menu, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-md border-b border-slate-200/50"
          : "bg-white/80 backdrop-blur-lg border-b border-slate-200/30"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <Logo
              className="h-12 w-auto group-hover:opacity-80 transition-opacity"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-slate-900 text-lg tracking-tight">Girardi & Auer</div>
              <div className="text-xs text-slate-500 tracking-wide">Rechtsanwälte · Innsbruck</div>
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
                    relative px-4 py-2 rounded-lg text-sm transition-all
                    ${
                      isActive
                        ? "text-[#1a365d]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }
                  `}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#1a365d] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+43512574095"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-[#1a365d] px-3 py-2 rounded-lg text-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">+43 512 574095</span>
            </a>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-[#1a365d] text-white px-6 py-2.5 rounded-xl hover:bg-[#152d4d] transition-all text-sm shadow-sm hover:shadow-md"
            >
              Termin vereinbaren
            </Link>
          </div>

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
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200 bg-white px-6 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  block px-4 py-3 rounded-lg text-base transition-all
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
          <div className="pt-4 space-y-3">
            <a
              href="tel:+43512574095"
              className="flex items-center justify-center gap-2 text-slate-700 px-4 py-3 rounded-xl border border-slate-200 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone className="w-4 h-4" />
              +43 512 574095
            </a>
            <Link
              to="/kontakt"
              className="block text-center bg-[#1a365d] text-white px-4 py-3 rounded-xl hover:bg-[#152d4d] transition-all text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Termin vereinbaren
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
