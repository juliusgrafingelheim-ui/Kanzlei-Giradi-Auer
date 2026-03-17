import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";

// Import App component
import App from "./app/App";

// Initialize Storyblok Bridge for Visual Editor (no-op if not in editor)
import { initStoryblokBridge } from "./lib/storyblok";
initStoryblokBridge();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
