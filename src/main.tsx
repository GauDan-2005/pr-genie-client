import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TempoDevtools } from "tempo-devtools";

axios.defaults.withCredentials = true;

// Initialize Tempo Devtools
TempoDevtools.init();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
