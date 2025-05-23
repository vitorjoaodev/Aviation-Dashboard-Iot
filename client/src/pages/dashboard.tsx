import React, { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StatusOverview } from "@/components/dashboard/status-overview";
import { RunwayMonitoring } from "@/components/dashboard/runway-monitoring";
import { WeatherMonitoring } from "@/components/dashboard/weather-monitoring";
import { EquipmentStatus } from "@/components/dashboard/equipment-status";
import { IncidentPanel } from "@/components/dashboard/incident-panel";
import { DataAnalysis } from "@/components/dashboard/data-analysis";
import { useDashboard } from "@/contexts/dashboard-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertSound } from "@/components/ui/alert-sound";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { 
    criticalAlert, 
    dismissCriticalAlert, 
    currentTime,
    notificationCount
  } = useDashboard();
  
  // Estado para controlar a reprodução do som
  const [playCriticalSound, setPlayCriticalSound] = useState(false);

  useEffect(() => {
    document.title = "GRU IOT - Dashboard SGSO";
  }, []);
  
  // Ativar o som quando um alerta crítico aparecer
  useEffect(() => {
    if (criticalAlert) {
      setPlayCriticalSound(true);
      // Desativar o som após 3 segundos
      const timer = setTimeout(() => setPlayCriticalSound(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [criticalAlert]);

  const formattedTime = format(currentTime, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operator"
        currentRoute="/"
      />

      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        {criticalAlert && (
          <Alert className="bg-critical text-white p-4 rounded-lg shadow-md flex items-start space-x-3 animate-pulse">
            <span className="material-icons">priority_high</span>
            <AlertDescription className="flex-1">
              <h3 className="font-bold">CRITICAL ALERT</h3>
              <p>{criticalAlert.message}</p>
            </AlertDescription>
            <button 
              className="p-1 hover:bg-critical-dark rounded-full"
              onClick={dismissCriticalAlert}
            >
              <span className="material-icons">close</span>
            </button>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <StatusOverview />
          <RunwayMonitoring />
          <WeatherMonitoring />
          <EquipmentStatus />
          <IncidentPanel />
          <DataAnalysis />
        </div>
      </main>

      <Footer 
        version="2.1.5" 
        lastUpdate="18/05/2023" 
      />
      
      {/* Componente de som para alertas críticos */}
      <AlertSound play={playCriticalSound} />
    </div>
  );
}
