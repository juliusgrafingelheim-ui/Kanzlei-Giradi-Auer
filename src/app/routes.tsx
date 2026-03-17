import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { PracticeAreasPage } from "./pages/PracticeAreasPage";
import { ContactPage } from "./pages/ContactPage";
import { ImpressumPage } from "./pages/ImpressumPage";
import { DatenschutzPage } from "./pages/DatenschutzPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "ueber-uns", Component: AboutPage },
      { path: "rechtsgebiete", Component: PracticeAreasPage },
      { path: "kontakt", Component: ContactPage },
      { path: "impressum", Component: ImpressumPage },
      { path: "datenschutz", Component: DatenschutzPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);