import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { reloadForNewDeploy } from "./utils/chunk-reload";

// Vite fires this when a modulepreload for a lazy chunk 404s, which happens to
// open tabs after a redeploy replaces the hashed filenames.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  reloadForNewDeploy();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
