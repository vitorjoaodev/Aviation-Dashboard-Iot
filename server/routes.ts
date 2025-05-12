import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertRunwaySchema, 
  insertWeatherSchema, 
  insertEquipmentSchema, 
  insertIncidentSchema,
  insertWeatherAlertSchema,
  insertCriticalAlertSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Initialize data
  let clients: WebSocket[] = [];
  
  // WebSocket server
  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.push(ws);
    
    // Send initial data
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'connected', message: 'Connected to GRU IOT WebSocket Server' }));
    }
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle client messages if needed
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected');
      clients = clients.filter(client => client !== ws);
    });
  });
  
  // Broadcast to all clients
  function broadcast(data: any) {
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
  
  // Simulate data updates at intervals
  setInterval(() => {
    const randomUpdate = Math.floor(Math.random() * 5);
    
    switch(randomUpdate) {
      case 0: // Update runway data
        broadcast({
          type: 'runwayUpdate',
          runway: {
            alertPoints: [
              { x: 25 + Math.random() * 10, y: 33 + Math.random() * 5, status: "critical" },
              { x: 50 + Math.random() * 10, y: 50 + Math.random() * 5, status: "operational" },
              { x: 75 + Math.random() * 10, y: 75 + Math.random() * 5, status: "warning" }
            ]
          },
          temperature: {
            chartData: Array.from({ length: 12 }, (_, i) => ({
              time: new Date(Date.now() - i * 1800000).toISOString().slice(11, 16),
              temp: 27 + Math.random() * 2
            })).reverse(),
            runways: [
              { name: "09R", temperature: `${(27.5 + Math.random() * 0.5).toFixed(1)}°C` },
              { name: "27L", temperature: `${(28.2 + Math.random() * 0.5).toFixed(1)}°C` },
              { name: "09L", temperature: `${(28.1 + Math.random() * 0.5).toFixed(1)}°C` }
            ]
          },
          friction: {
            chartData: Array.from({ length: 12 }, (_, i) => ({
              time: new Date(Date.now() - i * 1800000).toISOString().slice(11, 16),
              friction: 0.75 + Math.random() * 0.1
            })).reverse(),
            runways: [
              { name: "09R", friction: (0.82 + Math.random() * 0.03 - 0.015).toFixed(2) },
              { name: "27L", friction: (0.79 + Math.random() * 0.03 - 0.015).toFixed(2) },
              { name: "09L", friction: (0.78 + Math.random() * 0.03 - 0.015).toFixed(2) }
            ]
          }
        });
        break;
        
      case 1: // Update weather data
        broadcast({
          type: 'weatherUpdate',
          weather: {
            temperature: Math.round((25 + Math.random() * 2) * 10) / 10,
            feelsLike: Math.round((27 + Math.random() * 2) * 10) / 10,
            humidity: Math.round(72 + Math.random() * 6 - 3),
            dewPoint: Math.round((19 + Math.random() * 2) * 10) / 10,
            visibility: Math.round((5.2 + Math.random() * 1 - 0.5) * 10) / 10,
            visibilityStatus: Math.random() > 0.7 ? "normal" : "reduced",
            qnh: Math.round(1013 + Math.random() * 2 - 1),
            qnhTrend: Math.random() > 0.6 ? "Stable" : Math.random() > 0.5 ? "Rising" : "Falling",
            windDirection: Math.round(270 + Math.random() * 20 - 10),
            windSpeed: Math.round((12 + Math.random() * 4 - 2) * 10) / 10,
            windGust: Math.round((18 + Math.random() * 4 - 2) * 10) / 10,
            windHistory: Array.from({ length: 8 }, (_, i) => ({
              time: new Date(Date.now() - i * 1800000).toISOString().slice(11, 16),
              speed: 10 + Math.random() * 5
            })).reverse()
          },
          alerts: [
            {
              type: "warning",
              icon: "flash_on",
              title: "Storm Alert",
              description: `Electrical activity detected ${Math.round(15 + Math.random() * 5 - 2)}km south. Expected arrival in ${Math.round(25 + Math.random() * 10 - 5)}-${Math.round(30 + Math.random() * 10 - 5)} min.`
            },
            {
              type: "info",
              icon: "water_drop",
              title: "Precipitation",
              description: `Light rain expected for the next ${Math.round(2 + Math.random())} hours. Expected accumulation: 2-5mm.`
            }
          ]
        });
        break;
        
      case 2: // Update equipment status
        broadcast({
          type: 'equipmentUpdate',
          equipment: [
            {
              id: "equip-1",
              name: "Lighting System",
              status: "critical",
              location: "Taxiway C - Central Circuit",
              lastUpdate: `Failure detected: ${new Date().toTimeString().slice(0, 5)} - Technical team notified`
            },
            {
              id: "equip-2",
              name: "Surface Radar",
              status: "operational",
              location: "Primary Radar - North Tower",
              lastUpdate: `Last check: ${new Date().toTimeString().slice(0, 5)} - Normal operation`
            },
            {
              id: "equip-3",
              name: "PAPI System",
              status: "operational",
              location: "Runway 27L",
              lastUpdate: "Intensity: 100% - Next calibration: 05/25"
            },
            {
              id: "equip-4",
              name: "Approach Lights",
              status: "operational",
              location: "ALS Runway 09R",
              lastUpdate: "Normal operation - Intensity: 80%"
            },
            {
              id: "equip-5",
              name: "ATIS",
              status: "operational",
              location: "Automatic Transmission",
              lastUpdate: "Info BRAVO active - Updated: 14:00Z"
            },
            {
              id: "equip-6",
              name: Math.random() > 0.3 ? "Emergency Generator" : "UPS - Main System",
              status: Math.random() > 0.7 ? "operational" : "warning",
              location: "Generator #2 - Terminal 3",
              lastUpdate: `Fuel level: ${Math.round(40 + Math.random() * 10)}% - Refueling scheduled`
            }
          ]
        });
        break;
        
      case 3: // Random status update
        broadcast({
          type: 'statusUpdate',
          statusItems: [
            {
              id: "runway-main",
              title: "Main Runway (09R/27L)",
              status: Math.random() > 0.9 ? "warning" : "operational",
              metrics: [
                { label: "Temperature", value: `${(27.5 + Math.random() * 0.5).toFixed(1)}°C` },
                { label: "Friction", value: (0.82 + Math.random() * 0.03 - 0.015).toFixed(2) },
                { label: "Rain", value: Math.random() > 0.8 ? `${(Math.random() * 2).toFixed(1)} mm/h` : "0.0 mm/h" }
              ]
            },
            {
              id: "runway-aux",
              title: "Secondary Runway (09L/27R)",
              status: "operational",
              metrics: [
                { label: "Temperature", value: `${(28.1 + Math.random() * 0.5).toFixed(1)}°C` },
                { label: "Friction", value: (0.78 + Math.random() * 0.03 - 0.015).toFixed(2) },
                { label: "Rain", value: Math.random() > 0.8 ? `${(Math.random() * 2).toFixed(1)} mm/h` : "0.0 mm/h" }
              ]
            },
            {
              id: "weather-system",
              title: "Weather System",
              status: Math.random() > 0.7 ? "warning" : "operational",
              metrics: [
                { label: "Visibility", value: `${(5.2 + Math.random() * 1 - 0.5).toFixed(1)} km` },
                { label: "Wind", value: `${Math.round(12 + Math.random() * 2)} kt ${Math.round(270 + Math.random() * 20 - 10)}°` },
                { label: "Thunder", value: Math.random() > 0.7 ? `Detected (${Math.round(15 + Math.random() * 5)}km)` : "Not detected" }
              ]
            },
            {
              id: "lighting-system",
              title: "Lighting Systems",
              status: "critical",
              metrics: [
                { label: "Taxiway C", value: "Partial failure" },
                { label: "PAPI 27L", value: "100%" },
                { label: "Backup", value: "Active" }
              ]
            }
          ]
        });
        break;
        
      case 4: // Occasional critical alert
        if (Math.random() > 0.7) {
          const alertTypes = [
            "Foreign Object Debris (FOD) detected on runway 09R/27L - Inspection team mobilized - ETA: 3 min",
            "Wind gust over 25kt detected - Direction: 290° - Duration: 45 seconds",
            "Communication failure with runway 09L friction sensor - Manual verification required",
            "Unauthorized vehicle near taxiway D - Security team dispatched"
          ];
          
          broadcast({
            type: 'criticalAlert',
            alert: {
              id: `critical-${Date.now()}`,
              message: alertTypes[Math.floor(Math.random() * alertTypes.length)]
            }
          });
        }
        break;
    }
  }, 10000); // Every 10 seconds
  
  // API routes
  app.get('/api/dashboard/initial', async (req, res) => {
    try {
      // Get stored data if available, or create initial data
      const statusItems = await storage.getAllRunways();
      const equipment = await storage.getAllEquipment();
      const incidents = await storage.getAllIncidents();
      const weatherData = await storage.getLatestWeather();
      const weatherAlerts = await storage.getAllWeatherAlerts();
      const criticalAlert = await storage.getActiveCriticalAlert();
      
      // Format runway data
      const formattedRunways = statusItems.map(runway => ({
        id: `runway-${runway.id}`,
        title: runway.name,
        status: runway.status,
        metrics: [
          { label: "Temperatura", value: `${runway.temperature}°C` },
          { label: "Coef. Atrito", value: runway.friction.toString() },
          { label: "Chuva", value: `${runway.precipitation} mm/h` }
        ]
      }));
      
      // Format weather data
      const weather = weatherData ? {
        temperature: weatherData.temperature,
        feelsLike: weatherData.feelsLike,
        humidity: weatherData.humidity,
        dewPoint: weatherData.dewPoint,
        visibility: weatherData.visibility,
        visibilityStatus: weatherData.visibility < 5 ? "reduced" : "normal",
        qnh: weatherData.qnh,
        qnhTrend: "Estável",
        windDirection: weatherData.windDirection,
        windSpeed: weatherData.windSpeed,
        windGust: weatherData.windGust,
        windHistory: [] // Would come from time series data
      } : null;
      
      // Format incidents
      const formattedIncidents = incidents.map(incident => ({
        id: incident.referenceId,
        timestamp: new Date(incident.timestamp).toLocaleString('pt-BR'),
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: incident.status,
        actions: incident.actions
      }));
      
      // Format weather alerts
      const formattedAlerts = weatherAlerts.map(alert => ({
        type: alert.type,
        icon: alert.icon,
        title: alert.title,
        description: alert.description
      }));
      
      // Format equipment status
      const formattedEquipment = equipment.map(eq => ({
        id: `equip-${eq.id}`,
        name: eq.name,
        status: eq.status,
        location: eq.location,
        lastUpdate: new Date(eq.lastUpdated).toLocaleTimeString() + " - " + 
                    (eq.details ? eq.details.message : "Status atualizado")
      }));
      
      // Format critical alert
      const formattedAlert = criticalAlert ? {
        id: `critical-${criticalAlert.id}`,
        message: criticalAlert.message
      } : null;
      
      // Create mock data for charts since we don't have time series data yet
      const temperatureData = {
        chartData: Array.from({ length: 12 }, (_, i) => ({
          time: new Date(Date.now() - i * 1800000).toISOString().slice(11, 16),
          temp: 27 + Math.random() * 2
        })).reverse(),
        runways: [
          { name: "09R", temperature: "27.5°C" },
          { name: "27L", temperature: "28.2°C" },
          { name: "09L", temperature: "28.1°C" }
        ]
      };
      
      const frictionData = {
        chartData: Array.from({ length: 12 }, (_, i) => ({
          time: new Date(Date.now() - i * 1800000).toISOString().slice(11, 16),
          friction: 0.75 + Math.random() * 0.1
        })).reverse(),
        runways: [
          { name: "09R", friction: "0.82" },
          { name: "27L", friction: "0.79" },
          { name: "09L", friction: "0.78" }
        ]
      };
      
      const runwayData = {
        alertPoints: [
          { x: 25, y: 33, status: "critical" },
          { x: 50, y: 50, status: "operational" },
          { x: 75, y: 75, status: "warning" }
        ]
      };
      
      const analysisData = {
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
        incidentTrend: Array.from({ length: 7 }, (_, i) => {
          const date = new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
          return {
            date,
            critical: Math.floor(Math.random() * 5),
            warning: Math.floor(Math.random() * 8),
            info: Math.floor(Math.random() * 10)
          };
        }).reverse()
      };
      
      // Send response
      res.json({
        statusItems: formattedRunways.length > 0 ? formattedRunways : [
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
        ],
        equipment: formattedEquipment.length > 0 ? formattedEquipment : [
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
        ],
        incidents: formattedIncidents.length > 0 ? formattedIncidents : [
          {
            id: "FOD-2775",
            timestamp: "14:32 - 18/05/2023",
            title: "Detecção de FOD na pista 09R/27L",
            description: "Sistema de detecção automática identificou objeto metálico próximo à interseção com taxiway B. Dimensão estimada: 15cm.",
            severity: "critical"
          },
          {
            id: "WX-1125",
            timestamp: "14:20 - 18/05/2023",
            title: "Alerta de tempestade aproximando-se",
            description: "Sistema de detecção de raios identificou atividade elétrica a 15km ao sul do aeroporto. Previsão de chuva e rajadas de vento nos próximos 30 minutos.",
            severity: "warning"
          },
          {
            id: "EQP-3382",
            timestamp: "14:25 - 18/05/2023",
            title: "Falha no sistema de iluminação Taxiway C",
            description: "Falha detectada no circuito central de iluminação da Taxiway C. Aproximadamente 12 luzes afetadas. Equipe técnica notificada.",
            severity: "critical"
          },
          {
            id: "OPS-5521",
            timestamp: "13:47 - 18/05/2023",
            title: "Inspeção de rotina da pista 09L/27R concluída",
            description: "Inspeção visual e instrumental concluída sem identificação de problemas. Coeficiente de atrito medido: 0.78 (dentro dos parâmetros).",
            severity: "info"
          }
        ],
        weather: weather || {
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
          windHistory: Array.from({ length: 8 }, (_, i) => ({
            time: new Date(Date.now() - i * 1800000).toISOString().slice(11, 16),
            speed: 10 + Math.random() * 5
          })).reverse()
        },
        weatherAlerts: formattedAlerts.length > 0 ? formattedAlerts : [
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
        ],
        criticalAlert: formattedAlert || {
          id: "critical-1",
          message: "Detecção de objeto estranho (FOD) na pista 09R/27L - Equipe de inspeção mobilizada - ETA: 3 min"
        },
        runway: runwayData,
        temperature: temperatureData,
        friction: frictionData,
        analysis: analysisData
      });
    } catch (error) {
      console.error("Error fetching initial data:", error);
      res.status(500).json({ message: "Error fetching initial data" });
    }
  });
  
  app.get('/api/dashboard/refresh', (req, res) => {
    res.json({ newData: true });
  });
  
  app.post('/api/runways', async (req, res) => {
    try {
      const data = insertRunwaySchema.parse(req.body);
      const runway = await storage.createRunway(data);
      res.status(201).json(runway);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });
  
  app.post('/api/weather', async (req, res) => {
    try {
      const data = insertWeatherSchema.parse(req.body);
      const weather = await storage.createWeather(data);
      res.status(201).json(weather);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });
  
  app.post('/api/equipment', async (req, res) => {
    try {
      const data = insertEquipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(data);
      res.status(201).json(equipment);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });
  
  app.post('/api/incidents', async (req, res) => {
    try {
      const data = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(data);
      res.status(201).json(incident);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });
  
  app.post('/api/weather-alerts', async (req, res) => {
    try {
      const data = insertWeatherAlertSchema.parse(req.body);
      const alert = await storage.createWeatherAlert(data);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });
  
  app.post('/api/critical-alerts', async (req, res) => {
    try {
      const data = insertCriticalAlertSchema.parse(req.body);
      const alert = await storage.createCriticalAlert(data);
      res.status(201).json(alert);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });
  
  app.patch('/api/critical-alerts/:id/acknowledge', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.acknowledgeCriticalAlert(id);
      res.json(alert);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  });

  return httpServer;
}
