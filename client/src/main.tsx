import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/contexts/theme-context";
import { DashboardProvider } from "@/contexts/dashboard-context";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </ThemeProvider>
);
