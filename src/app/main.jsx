import "@/app/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register"; // Register service worker

import App from "@/app/App.jsx";
registerSW({ immediate: true });
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {" "}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {" "}
      <App />{" "}
    </BrowserRouter>{" "}
  </StrictMode>
);
