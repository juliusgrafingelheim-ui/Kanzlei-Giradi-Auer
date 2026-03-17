import { Outlet } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";
import { ScrollToTop } from "./components/ScrollToTop";

export function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}