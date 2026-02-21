import "@/app/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register"; // Register service worker

import App from "@/app/App";

// registerSW({ immediate: true });

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    {" "}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {" "}
      <App />{" "}
    </BrowserRouter>{" "}
  </StrictMode>
);
