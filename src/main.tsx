import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

import { LangProvider } from "./i18n/LangContext";
import { ThemeProvider } from "./theme/ThemeContext";

const rootEl = document.getElementById("root")!;

// Default to English (LTR). User can switch to Arabic (RTL) via LangToggle.
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("dir", "ltr");
  document.documentElement.setAttribute("lang", "en");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider>
      <LangProvider initialLang="en">
        <App />
      </LangProvider>
    </ThemeProvider>
  </React.StrictMode>
);

