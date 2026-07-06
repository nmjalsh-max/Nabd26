import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/fonts.css";

import { LangProvider } from "./i18n/LangContext";


const rootEl = document.getElementById("root")!;

// Force RTL-by-default for Arabic-first UI.
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.setAttribute("lang", "ar");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <LangProvider initialLang="en">
      <App />
    </LangProvider>
  </React.StrictMode>
);



