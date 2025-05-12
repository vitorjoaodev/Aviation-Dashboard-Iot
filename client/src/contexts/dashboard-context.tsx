import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { useWebSocket } from "@/hooks/use-websocket";
import { StatusType } from "@/components/ui/status-card";
import { IncidentSeverity } from "@/components/ui/incident-item";
import { apiRequest } from "@/lib/queryClient";

interface StatusItem {
  id: string;
  title: string;
  status: StatusType;
  metrics: { label: string; value: string }[];
}

interface EquipmentItem {
  id: string;
  name: string;
  status: StatusType;
  location: string;
  lastUpdate: string;
}

interface Incident {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status?: string;
  actions?: string[];
}

interface WeatherAlert {
  type: "warning" | "info";
  icon: string;
  title: string;
  description: string;
}

interface MaintenancePrediction {
  equipment: string;
  prediction: string;
  reason: string;
  status: string;
}

interface RunwayPoint {
  x: number;
  y: number;
  status: StatusType;
}

interface RunwayData {
  alertPoints: RunwayPoint[];
}

interface RunwayTemp {
  name: string;
  temperature: string;
}

interface RunwayFriction {
  name: string;
  friction: string;
}

interface TemperatureData {
  chartData: { time: string; temp: number }[];
  runways: RunwayTemp[];
}

interface FrictionData {
  chartData: { time: string; friction: number }[];
  runways: RunwayFriction[];
}

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  visibility: number;
  visibilityStatus: "normal" | "reduced";
  qnh: number;
  qnhTrend: string;
  windDirection: number;
  windSpeed: number;
  windGust: number;
  windHistory: { time: string; speed: number }[];
}

interface AnalysisData {
  incidentsByCategory: { name: string; value: number; color: string }[];
  totalIncidents: number;
  responseTime: { name: string; value: number }[];
  responseTimeStats: {
    average: number;
    best: number;
    target: number;
  };
  maintenancePredictions: MaintenancePrediction[];
  incidentTrend: {
    date: string;
    critical: number;
    warning: number;
    info: number;
  }[];
}

interface CriticalAlert {
  id: string;
  message: string;
}

interface DashboardContextType {
  statusItems: StatusItem[];
  equipmentStatus: EquipmentItem[];
  incidents: Incident[];
  weatherAlerts: WeatherAlert[];
  weatherData: WeatherData;
  runwayData: RunwayData;
  temperatureData: TemperatureData;
  frictionData: FrictionData;
  analysisData: AnalysisData;
  timeRange: string;
  setTimeRange: (range: string) => void;
  analysisPeriod: string;
  setAnalysisPeriod: (period: string) => void;
  refreshData: () => void;
  criticalAlert: CriticalAlert | null;
  dismissCriticalAlert: () => void;
  currentTime: Date;
  notificationCount: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
  const [equipmentStatus, setEquipmentStatus] = useState<EquipmentItem[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 25,
    feelsLike: 27,
    humidity: 72,
    dewPoint: 19,
    visibility: 5.2,
    visibilityStatus: "reduced",
    qnh: 1013,
    qnhTrend: "Estável",
    windDirection: 270,
    windSpeed: 12,
    windGust: 18,
    windHistory: []
  });
  const [runwayData, setRunwayData] = useState<RunwayData>({
    alertPoints: [
      { x: 25, y: 33, status: "critical" },
      { x: 50, y: 50, status: "operational" },
      { x: 75, y: 75, status: "warning" }
    ]
  });
  const [temperatureData, setTemperatureData] = useState<TemperatureData>({
    chartData: [],
    runways: [
      { name: "09R", temperature: "27.5°C" },
      { name: "27L", temperature: "28.2°C" },
      { name: "09L", temperature: "28.1°C" }
    ]
  });
  const [frictionData, setFrictionData] = useState<FrictionData>({
    chartData: [],
    runways: [
      { name: "09R", friction: "0.82" },
      { name: "27L", friction: "0.79" },
      { name: "09L", friction: "0.78" }
    ]
  });
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    incidentsByCategory: [
      { name: "FOD", value: 14, color: "#D50000" },
      { name: "Clima", value: 8, color: "#F9A825" },
      { name: "Equipamentos", value: 12, color: "#1A73E8" },
      { name: "Outros", value: 10, color: "#616E7C" }
    ],
    totalIncidents: 44,
    responseTime: [
      { name: "FOD", value: 3.2 },
      { name: "Clima", value: 4.8 },
      { name: "Equip.", value: 5.1 },
      { name: "Outros", value: 4.1 }
    ],
    responseTimeStats: {
      average: 4.3,
      best: 1.2,
      target: 5.0
    },
    maintenancePredictions: [
      { 
        equipment: "Sistema PAPI - Pista 09R", 
        prediction: "Manutenção preventiva necessária em 8 dias", 
        reason: "Intensidade reduzida detectada",
        status: "warning"
      },
      { 
        equipment: "Sensor de Atrito - Equip. #3", 
        prediction: "Calibração recomendada em 12 dias", 
        reason: "Desvio padrão aumentando",
        status: "warning"
      },
      { 
        equipment: "Radar de Superfície - Torre Sul", 
        prediction: "Verificação agendada em 30 dias", 
        reason: "Operando normalmente",
        status: "primary"
      }
    ],
    incidentTrend: []
  });
  const [timeRange, setTimeRange] = useState("realtime");
  const [analysisPeriod, setAnalysisPeriod] = useState("24h");
  const [criticalAlert, setCriticalAlert] = useState<CriticalAlert | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationCount, setNotificationCount] = useState(4);

  const dismissCriticalAlert = useCallback(() => {
    setCriticalAlert(null);
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const response = await apiRequest('GET', '/api/dashboard/refresh', undefined);
      const data = await response.json();
      
      if (data.newData) {
        // Update states with new data
        console.log("Dashboard data refreshed");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }, []);

  // Handle WebSocket messages
  const handleWebSocketMessage = useCallback((data: any) => {
    console.log("WebSocket message received:", data);
    
    if (data.type === "statusUpdate") {
      setStatusItems(data.statusItems);
    }
    
    if (data.type === "equipmentUpdate") {
      setEquipmentStatus(data.equipment);
    }
    
    if (data.type === "incidentUpdate") {
      setIncidents(data.incidents);
    }
    
    if (data.type === "weatherUpdate") {
      setWeatherData(data.weather);
      setWeatherAlerts(data.alerts);
    }
    
    if (data.type === "runwayUpdate") {
      setRunwayData(data.runway);
      setTemperatureData(data.temperature);
      setFrictionData(data.friction);
    }
    
    if (data.type === "analysisUpdate") {
      setAnalysisData(data.analysis);
    }
    
    if (data.type === "criticalAlert") {
      setCriticalAlert(data.alert);
    }
  }, []);

  // Initialize WebSocket connection
  const { status: wsStatus } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onOpen: () => {
      console.log("WebSocket connected");
    },
    onClose: () => {
      console.log("WebSocket disconnected");
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
    autoReconnect: true
  });

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await apiRequest('GET', '/api/dashboard/initial', undefined);
        const data = await response.json();
        
        setStatusItems(data.statusItems);
        setEquipmentStatus(data.equipment);
        setIncidents(data.incidents);
        setWeatherData(data.weather);
        setWeatherAlerts(data.weatherAlerts);
        setRunwayData(data.runway);
        setTemperatureData(data.temperature);
        setFrictionData(data.friction);
        setAnalysisData(data.analysis);
        setCriticalAlert(data.criticalAlert);
      } catch (error) {
        console.error("Error loading initial data:", error);
        
        // Set some default data for demonstration purposes
        setStatusItems([
          {
            id: "runway-main",
            title: "Pista Principal (09R/27L)",
            status: "operational",
            metrics: [
              { label: "Temperatura", value: "27.5°C" },
              { label: "Coef. Atrito", value: "0.82" },
              { label: "Chuva", value: "0.0 mm/h" }
            ]
          },
          {
            id: "runway-aux",
            title: "Pista Auxiliar (09L/27R)",
            status: "operational",
            metrics: [
              { label: "Temperatura", value: "28.1°C" },
              { label: "Coef. Atrito", value: "0.78" },
              { label: "Chuva", value: "0.0 mm/h" }
            ]
          },
          {
            id: "weather-system",
            title: "Sistema Meteorológico",
            status: "warning",
            metrics: [
              { label: "Visibilidade", value: "5.2 km" },
              { label: "Vento", value: "12 kt 270°" },
              { label: "Trovões", value: "Detectados (15km)" }
            ]
          },
          {
            id: "lighting-system",
            title: "Sistemas de Iluminação",
            status: "critical",
            metrics: [
              { label: "Taxiway C", value: "Falha parcial" },
              { label: "PAPI 27L", value: "100%" },
              { label: "Backup", value: "Ativo" }
            ]
          }
        ]);
        
        setEquipmentStatus([
          {
            id: "equip-1",
            name: "Sistema de Iluminação",
            status: "critical",
            location: "Taxiway C - Circuito Central",
            lastUpdate: "Falha detectada: 14:25 - Equipe técnica notificada"
          },
          {
            id: "equip-2",
            name: "Radar de Superfície",
            status: "operational",
            location: "Radar Primário - Torre Norte",
            lastUpdate: "Última verificação: 14:30 - Funcionamento normal"
          },
          {
            id: "equip-3",
            name: "Sistema PAPI",
            status: "operational",
            location: "Pista 27L",
            lastUpdate: "Intensidade: 100% - Próxima calibração: 25/05"
          },
          {
            id: "equip-4",
            name: "Luzes de Aproximação",
            status: "operational",
            location: "ALS Pista 09R",
            lastUpdate: "Funcionamento normal - Intensidade: 80%"
          },
          {
            id: "equip-5",
            name: "ATIS",
            status: "operational",
            location: "Transmissão Automática",
            lastUpdate: "Info BRAVO ativa - Atualizado: 14:00Z"
          },
          {
            id: "equip-6",
            name: "Gerador de Emergência",
            status: "warning",
            location: "Gerador #2 - Terminal 3",
            lastUpdate: "Nível de combustível: 42% - Abastecimento agendado"
          }
        ]);
        
        setIncidents([
          {
            id: "FOD-2775",
            timestamp: "14:32 - 18/05/2023",
            title: "Detecção de FOD na pista 09R/27L",
            description: "Sistema de detecção automática identificou objeto metálico próximo à interseção com taxiway B. Dimensão estimada: 15cm.",
            severity: "critical",
            status: "Em análise",
            actions: [
              "Equipe de inspeção mobilizada - ETA: 3 min",
              "Notificação enviada para Torre de Controle",
              "Alerta de segurança emitido para aeronaves"
            ]
          },
          {
            id: "WX-1125",
            timestamp: "14:20 - 18/05/2023",
            title: "Alerta de tempestade aproximando-se",
            description: "Sistema de detecção de raios identificou atividade elétrica a 15km ao sul do aeroporto. Previsão de chuva e rajadas de vento nos próximos 30 minutos.",
            severity: "warning",
            status: "Monitorando",
            actions: [
              "Monitoramento ativo com atualização a cada 5 minutos",
              "Prealerta enviado para equipes de pátio",
              "Plano de contingência meteorológica em standby"
            ]
          },
          {
            id: "EQP-3382",
            timestamp: "14:25 - 18/05/2023",
            title: "Falha no sistema de iluminação Taxiway C",
            description: "Falha detectada no circuito central de iluminação da Taxiway C. Aproximadamente 12 luzes afetadas. Equipe técnica notificada.",
            severity: "critical",
            status: "Em reparo",
            actions: [
              "Equipe técnica enviada ao local - ETA: 10 min",
              "Circuito de backup ativado",
              "Notificação enviada a todas as aeronaves em solo"
            ]
          },
          {
            id: "OPS-5521",
            timestamp: "13:47 - 18/05/2023",
            title: "Inspeção de rotina da pista 09L/27R concluída",
            description: "Inspeção visual e instrumental concluída sem identificação de problemas. Coeficiente de atrito medido: 0.78 (dentro dos parâmetros).",
            severity: "info",
            status: "Concluído",
            actions: [
              "Relatório arquivado no sistema",
              "Próxima inspeção agendada para 19/05 às 08:00"
            ]
          }
        ]);
        
        setWeatherAlerts([
          {
            type: "warning",
            icon: "flash_on",
            title: "Alerta de Tempestade",
            description: "Atividade elétrica detectada a 15km ao sul. Previsão de chegada em 25-30 min."
          },
          {
            type: "info",
            icon: "water_drop",
            title: "Precipitação",
            description: "Chuva fraca prevista para as próximas 2 horas. Acumulado esperado: 2-5mm."
          }
        ]);
        
        setCriticalAlert({
          id: "critical-1",
          message: "Detecção de objeto estranho (FOD) na pista 09R/27L - Equipe de inspeção mobilizada - ETA: 3 min"
        });
        
        // Generate some historical data for charts
        const tempHistorical = Array.from({ length: 12 }, (_, i) => ({
          time: format(new Date(Date.now() - i * 1800000), "HH:mm"),
          temp: 27 + Math.random() * 2
        })).reverse();
        
        const frictionHistorical = Array.from({ length: 12 }, (_, i) => ({
          time: format(new Date(Date.now() - i * 1800000), "HH:mm"),
          friction: 0.75 + Math.random() * 0.1
        })).reverse();
        
        const windHistorical = Array.from({ length: 8 }, (_, i) => ({
          time: format(new Date(Date.now() - i * 1800000), "HH:mm"),
          speed: 10 + Math.random() * 5
        })).reverse();
        
        const trendHistorical = Array.from({ length: 7 }, (_, i) => {
          const date = format(new Date(Date.now() - i * 86400000), "dd/MM");
          return {
            date,
            critical: Math.floor(Math.random() * 5),
            warning: Math.floor(Math.random() * 8),
            info: Math.floor(Math.random() * 10)
          };
        }).reverse();
        
        setTemperatureData(prev => ({
          ...prev,
          chartData: tempHistorical
        }));
        
        setFrictionData(prev => ({
          ...prev,
          chartData: frictionHistorical
        }));
        
        setWeatherData(prev => ({
          ...prev,
          windHistory: windHistorical
        }));
        
        setAnalysisData(prev => ({
          ...prev,
          incidentTrend: trendHistorical
        }));
      }
    }
    
    loadInitialData();
  }, []);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const value: DashboardContextType = {
    statusItems,
    equipmentStatus,
    incidents,
    weatherAlerts,
    weatherData,
    runwayData,
    temperatureData,
    frictionData,
    analysisData,
    timeRange,
    setTimeRange,
    analysisPeriod,
    setAnalysisPeriod,
    refreshData,
    criticalAlert,
    dismissCriticalAlert,
    currentTime,
    notificationCount
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
