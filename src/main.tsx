import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

import { LangProvider } from "./i18n/LangContext";
import { ThemeProvider } from "./theme/ThemeContext";

const rootEl = document.getElementById("root")!;

// Default to Arabic (RTL) — matches index.html and the target audience.
// Users can switch to English (LTR) via LangToggle.
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.setAttribute("lang", "ar");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider>
      <LangProvider initialLang="ar">
        <App />
      </LangProvider>
    </ThemeProvider>
  </React.StrictMode>
);

