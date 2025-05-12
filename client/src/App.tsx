import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Runways from "@/pages/runways";
import Weather from "@/pages/weather";
import Equipment from "@/pages/equipment";
import Incidents from "@/pages/incidents";
import Analysis from "@/pages/analysis";
import FlightRadar from "@/pages/flight-radar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/pistas" component={Runways} />
      <Route path="/meteorologia" component={Weather} />
      <Route path="/equipamentos" component={Equipment} />
      <Route path="/incidentes" component={Incidents} />
      <Route path="/analises" component={Analysis} />
      <Route path="/flightradar" component={FlightRadar} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
