/**
 * This module generates realistic mock data for development and testing.
 * It's used by the WebSocket server to simulate real-time data updates.
 */
import { format } from "date-fns";
import { StatusType } from "@/components/ui/status-card";
import { IncidentSeverity } from "@/components/ui/incident-item";

// Helper function to generate a random number within a range
export function randomNumber(min: number, max: number, decimals = 0): number {
  const value = Math.random() * (max - min) + min;
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// Helper function to randomly select an item from an array
export function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// Helper function to get a time string for n minutes ago
export function timeMinutesAgo(minutes: number): string {
  const date = new Date(Date.now() - minutes * 60 * 1000);
  return format(date, "HH:mm - dd/MM/yyyy");
}

// Helper function to get a date string for n days ago
export function dateDaysAgo(days: number): string {
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return format(date, "dd/MM");
}

// Generate runway status data
export function generateRunwayStatusItems() {
  return [
    {
      id: "runway-main",
      title: "Pista Principal (09R/27L)",
      status: Math.random() > 0.9 ? "warning" as StatusType : "operational" as StatusType,
      metrics: [
        { label: "Temperatura", value: `${(27.5 + Math.random() * 0.5).toFixed(1)}°C` },
        { label: "Coef. Atrito", value: (0.82 + Math.random() * 0.03 - 0.015).toFixed(2) },
        { label: "Chuva", value: Math.random() > 0.8 ? `${(Math.random() * 2).toFixed(1)} mm/h` : "0.0 mm/h" }
      ]
    },
    {
      id: "runway-aux",
      title: "Pista Auxiliar (09L/27R)",
      status: "operational" as StatusType,
      metrics: [
        { label: "Temperatura", value: `${(28.1 + Math.random() * 0.5).toFixed(1)}°C` },
        { label: "Coef. Atrito", value: (0.78 + Math.random() * 0.03 - 0.015).toFixed(2) },
        { label: "Chuva", value: Math.random() > 0.8 ? `${(Math.random() * 2).toFixed(1)} mm/h` : "0.0 mm/h" }
      ]
    },
    {
      id: "weather-system",
      title: "Sistema Meteorológico",
      status: Math.random() > 0.7 ? "warning" as StatusType : "operational" as StatusType,
      metrics: [
        { label: "Visibilidade", value: `${(5.2 + Math.random() * 1 - 0.5).toFixed(1)} km` },
        { label: "Vento", value: `${Math.round(12 + Math.random() * 2)} kt ${Math.round(270 + Math.random() * 20 - 10)}°` },
        { label: "Trovões", value: Math.random() > 0.7 ? `Detectados (${Math.round(15 + Math.random() * 5)}km)` : "Não detectados" }
      ]
    },
    {
      id: "lighting-system",
      title: "Sistemas de Iluminação",
      status: "critical" as StatusType,
      metrics: [
        { label: "Taxiway C", value: "Falha parcial" },
        { label: "PAPI 27L", value: "100%" },
        { label: "Backup", value: "Ativo" }
      ]
    }
  ];
}

// Generate equipment status data
export function generateEquipmentStatus() {
  return [
    {
      id: "equip-1",
      name: "Sistema de Iluminação",
      status: "critical" as StatusType,
      location: "Taxiway C - Circuito Central",
      lastUpdate: `Falha detectada: ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - Equipe técnica notificada`
    },
    {
      id: "equip-2",
      name: "Radar de Superfície",
      status: "operational" as StatusType,
      location: "Radar Primário - Torre Norte",
      lastUpdate: `Última verificação: ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - Funcionamento normal`
    },
    {
      id: "equip-3",
      name: "Sistema PAPI",
      status: "operational" as StatusType,
      location: "Pista 27L",
      lastUpdate: "Intensidade: 100% - Próxima calibração: 25/05"
    },
    {
      id: "equip-4",
      name: "Luzes de Aproximação",
      status: "operational" as StatusType,
      location: "ALS Pista 09R",
      lastUpdate: "Funcionamento normal - Intensidade: 80%"
    },
    {
      id: "equip-5",
      name: "ATIS",
      status: "operational" as StatusType,
      location: "Transmissão Automática",
      lastUpdate: "Info BRAVO ativa - Atualizado: 14:00Z"
    },
    {
      id: "equip-6",
      name: Math.random() > 0.3 ? "Gerador de Emergência" : "UPS - Sistema Principal",
      status: Math.random() > 0.7 ? "operational" as StatusType : "warning" as StatusType,
      location: "Gerador #2 - Terminal 3",
      lastUpdate: `Nível de combustível: ${Math.round(40 + Math.random() * 10)}% - Abastecimento agendado`
    }
  ];
}

// Generate weather data
export function generateWeatherData() {
  return {
    temperature: Math.round((25 + Math.random() * 2) * 10) / 10,
    feelsLike: Math.round((27 + Math.random() * 2) * 10) / 10,
    humidity: Math.round(72 + Math.random() * 6 - 3),
    dewPoint: Math.round((19 + Math.random() * 2) * 10) / 10,
    visibility: Math.round((5.2 + Math.random() * 1 - 0.5) * 10) / 10,
    visibilityStatus: Math.random() > 0.7 ? "normal" : "reduced",
    qnh: Math.round(1013 + Math.random() * 2 - 1),
    qnhTrend: Math.random() > 0.6 ? "Estável" : Math.random() > 0.5 ? "Subindo" : "Descendo",
    windDirection: Math.round(270 + Math.random() * 20 - 10),
    windSpeed: Math.round((12 + Math.random() * 4 - 2) * 10) / 10,
    windGust: Math.round((18 + Math.random() * 4 - 2) * 10) / 10,
    windHistory: Array.from({ length: 8 }, (_, i) => ({
      time: format(new Date(Date.now() - i * 1800000), "HH:mm"),
      speed: 10 + Math.random() * 5
    })).reverse()
  };
}

// Generate weather alerts
export function generateWeatherAlerts() {
  return [
    {
      type: "warning",
      icon: "flash_on",
      title: "Alerta de Tempestade",
      description: `Atividade elétrica detectada a ${Math.round(15 + Math.random() * 5 - 2)}km ao sul. Previsão de chegada em ${Math.round(25 + Math.random() * 10 - 5)}-${Math.round(30 + Math.random() * 10 - 5)} min.`
    },
    {
      type: "info",
      icon: "water_drop",
      title: "Precipitação",
      description: `Chuva fraca prevista para as próximas ${Math.round(2 + Math.random())} horas. Acumulado esperado: 2-5mm.`
    }
  ];
}

// Generate runway monitoring data
export function generateRunwayData() {
  return {
    alertPoints: [
      { x: 25 + Math.random() * 10, y: 33 + Math.random() * 5, status: "critical" as StatusType },
      { x: 50 + Math.random() * 10, y: 50 + Math.random() * 5, status: "operational" as StatusType },
      { x: 75 + Math.random() * 10, y: 75 + Math.random() * 5, status: "warning" as StatusType }
    ]
  };
}

// Generate temperature data for runway chart
export function generateTemperatureData() {
  return {
    chartData: Array.from({ length: 12 }, (_, i) => ({
      time: format(new Date(Date.now() - i * 1800000), "HH:mm"),
      temp: 27 + Math.random() * 2
    })).reverse(),
    runways: [
      { name: "09R", temperature: `${(27.5 + Math.random() * 0.5).toFixed(1)}°C` },
      { name: "27L", temperature: `${(28.2 + Math.random() * 0.5).toFixed(1)}°C` },
      { name: "09L", temperature: `${(28.1 + Math.random() * 0.5).toFixed(1)}°C` }
    ]
  };
}

// Generate friction data for runway chart
export function generateFrictionData() {
  return {
    chartData: Array.from({ length: 12 }, (_, i) => ({
      time: format(new Date(Date.now() - i * 1800000), "HH:mm"),
      friction: 0.75 + Math.random() * 0.1
    })).reverse(),
    runways: [
      { name: "09R", friction: (0.82 + Math.random() * 0.03 - 0.015).toFixed(2) },
      { name: "27L", friction: (0.79 + Math.random() * 0.03 - 0.015).toFixed(2) },
      { name: "09L", friction: (0.78 + Math.random() * 0.03 - 0.015).toFixed(2) }
    ]
  };
}

// Generate incidents
export function generateIncidents() {
  return [
    {
      id: "FOD-2775",
      timestamp: timeMinutesAgo(randomNumber(5, 30)),
      title: "Detecção de FOD na pista 09R/27L",
      description: "Sistema de detecção automática identificou objeto metálico próximo à interseção com taxiway B. Dimensão estimada: 15cm.",
      severity: "critical" as IncidentSeverity,
      status: "Em análise",
      actions: [
        "Equipe de inspeção mobilizada - ETA: 3 min",
        "Notificação enviada para Torre de Controle",
        "Alerta de segurança emitido para aeronaves"
      ]
    },
    {
      id: "WX-1125",
      timestamp: timeMinutesAgo(randomNumber(35, 60)),
      title: "Alerta de tempestade aproximando-se",
      description: "Sistema de detecção de raios identificou atividade elétrica a 15km ao sul do aeroporto. Previsão de chuva e rajadas de vento nos próximos 30 minutos.",
      severity: "warning" as IncidentSeverity,
      status: "Monitorando",
      actions: [
        "Monitoramento ativo com atualização a cada 5 minutos",
        "Prealerta enviado para equipes de pátio",
        "Plano de contingência meteorológica em standby"
      ]
    },
    {
      id: "EQP-3382",
      timestamp: timeMinutesAgo(randomNumber(65, 90)),
      title: "Falha no sistema de iluminação Taxiway C",
      description: "Falha detectada no circuito central de iluminação da Taxiway C. Aproximadamente 12 luzes afetadas. Equipe técnica notificada.",
      severity: "critical" as IncidentSeverity,
      status: "Em reparo",
      actions: [
        "Equipe técnica enviada ao local - ETA: 10 min",
        "Circuito de backup ativado",
        "Notificação enviada a todas as aeronaves em solo"
      ]
    },
    {
      id: "OPS-5521",
      timestamp: timeMinutesAgo(randomNumber(95, 120)),
      title: "Inspeção de rotina da pista 09L/27R concluída",
      description: "Inspeção visual e instrumental concluída sem identificação de problemas. Coeficiente de atrito medido: 0.78 (dentro dos parâmetros).",
      severity: "info" as IncidentSeverity,
      status: "Concluído",
      actions: [
        "Relatório arquivado no sistema",
        "Próxima inspeção agendada para 19/05 às 08:00"
      ]
    }
  ];
}

// Generate analysis data
export function generateAnalysisData() {
  const totalIncidents = 44;
  const fodCount = Math.floor(totalIncidents * 0.32);
  const weatherCount = Math.floor(totalIncidents * 0.18);
  const equipmentCount = Math.floor(totalIncidents * 0.27);
  const otherCount = totalIncidents - fodCount - weatherCount - equipmentCount;
  
  return {
    incidentsByCategory: [
      { name: "FOD", value: fodCount, color: "#D50000" },
      { name: "Clima", value: weatherCount, color: "#F9A825" },
      { name: "Equipamentos", value: equipmentCount, color: "#1A73E8" },
      { name: "Outros", value: otherCount, color: "#616E7C" }
    ],
    totalIncidents,
    responseTime: [
      { name: "FOD", value: 3.2 + (Math.random() * 0.6 - 0.3) },
      { name: "Clima", value: 4.8 + (Math.random() * 0.6 - 0.3) },
      { name: "Equip.", value: 5.1 + (Math.random() * 0.6 - 0.3) },
      { name: "Outros", value: 4.1 + (Math.random() * 0.6 - 0.3) }
    ],
    responseTimeStats: {
      average: 4.3 + (Math.random() * 0.4 - 0.2),
      best: 1.2 + (Math.random() * 0.2 - 0.1),
      target: 5.0
    },
    maintenancePredictions: [
      { 
        equipment: "Sistema PAPI - Pista 09R", 
        prediction: `Manutenção preventiva necessária em ${Math.round(8 + Math.random() * 3 - 1)} dias`, 
        reason: "Intensidade reduzida detectada",
        status: "warning"
      },
      { 
        equipment: "Sensor de Atrito - Equip. #3", 
        prediction: `Calibração recomendada em ${Math.round(12 + Math.random() * 4 - 2)} dias`, 
        reason: "Desvio padrão aumentando",
        status: "warning"
      },
      { 
        equipment: "Radar de Superfície - Torre Sul", 
        prediction: `Verificação agendada em ${Math.round(30 + Math.random() * 5 - 2)} dias`, 
        reason: "Operando normalmente",
        status: "primary"
      }
    ],
    incidentTrend: Array.from({ length: 7 }, (_, i) => {
      const date = dateDaysAgo(6 - i);
      return {
        date,
        critical: Math.floor(Math.random() * 5),
        warning: Math.floor(Math.random() * 8),
        info: Math.floor(Math.random() * 10)
      };
    })
  };
}

// Generate a new critical alert
export function generateCriticalAlert() {
  const alertTypes = [
    "Detecção de objeto estranho (FOD) na pista 09R/27L - Equipe de inspeção mobilizada - ETA: 3 min",
    "Rajada de vento superior a 25kt detectada - Direção: 290° - Duração: 45 segundos",
    "Falha na comunicação com sensor de atrito da pista 09L - Verificação manual necessária",
    "Veículo não autorizado próximo à taxiway D - Equipe de segurança acionada"
  ];
  
  return {
    id: `critical-${Date.now()}`,
    message: randomItem(alertTypes)
  };
}
