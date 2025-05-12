import { 
  users, 
  runways, 
  weather, 
  equipment, 
  incidents, 
  weatherAlerts, 
  criticalAlerts,
  type User, 
  type InsertUser,
  type Runway,
  type InsertRunway,
  type Weather,
  type InsertWeather, 
  type Equipment,
  type InsertEquipment,
  type Incident,
  type InsertIncident,
  type WeatherAlert,
  type InsertWeatherAlert,
  type CriticalAlert,
  type InsertCriticalAlert
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Runway operations
  getRunway(id: number): Promise<Runway | undefined>;
  getAllRunways(): Promise<Runway[]>;
  createRunway(runway: InsertRunway): Promise<Runway>;
  updateRunway(id: number, data: Partial<InsertRunway>): Promise<Runway>;
  
  // Weather operations
  getLatestWeather(): Promise<Weather | undefined>;
  createWeather(weather: InsertWeather): Promise<Weather>;
  getWeatherHistory(limit: number): Promise<Weather[]>;
  
  // Equipment operations
  getEquipment(id: number): Promise<Equipment | undefined>;
  getAllEquipment(): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, data: Partial<InsertEquipment>): Promise<Equipment>;
  
  // Incident operations
  getIncident(id: number): Promise<Incident | undefined>;
  getIncidentByReference(referenceId: string): Promise<Incident | undefined>;
  getAllIncidents(): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, data: Partial<InsertIncident>): Promise<Incident>;
  
  // Weather alert operations
  getWeatherAlert(id: number): Promise<WeatherAlert | undefined>;
  getAllWeatherAlerts(): Promise<WeatherAlert[]>;
  getActiveWeatherAlerts(): Promise<WeatherAlert[]>;
  createWeatherAlert(alert: InsertWeatherAlert): Promise<WeatherAlert>;
  deactivateWeatherAlert(id: number): Promise<WeatherAlert>;
  
  // Critical alert operations
  getCriticalAlert(id: number): Promise<CriticalAlert | undefined>;
  getAllCriticalAlerts(): Promise<CriticalAlert[]>;
  getActiveCriticalAlert(): Promise<CriticalAlert | undefined>;
  createCriticalAlert(alert: InsertCriticalAlert): Promise<CriticalAlert>;
  acknowledgeCriticalAlert(id: number): Promise<CriticalAlert>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private runways: Map<number, Runway>;
  private weatherEntries: Map<number, Weather>;
  private equipmentEntries: Map<number, Equipment>;
  private incidentEntries: Map<number, Incident>;
  private weatherAlertEntries: Map<number, WeatherAlert>;
  private criticalAlertEntries: Map<number, CriticalAlert>;
  
  private userCounter: number;
  private runwayCounter: number;
  private weatherCounter: number;
  private equipmentCounter: number;
  private incidentCounter: number;
  private weatherAlertCounter: number;
  private criticalAlertCounter: number;

  constructor() {
    this.users = new Map();
    this.runways = new Map();
    this.weatherEntries = new Map();
    this.equipmentEntries = new Map();
    this.incidentEntries = new Map();
    this.weatherAlertEntries = new Map();
    this.criticalAlertEntries = new Map();
    
    this.userCounter = 1;
    this.runwayCounter = 1;
    this.weatherCounter = 1;
    this.equipmentCounter = 1;
    this.incidentCounter = 1;
    this.weatherAlertCounter = 1;
    this.criticalAlertCounter = 1;
    
    // Initialize with default data for development
    this.initDefaultData();
  }
  
  private initDefaultData() {
    // Create default runways
    const runways: InsertRunway[] = [
      {
        name: "Pista Principal (09R/27L)",
        status: "operational",
        temperature: 27.5,
        friction: 0.82,
        precipitation: 0.0
      },
      {
        name: "Pista Auxiliar (09L/27R)",
        status: "operational",
        temperature: 28.1,
        friction: 0.78,
        precipitation: 0.0
      }
    ];
    
    runways.forEach(runway => this.createRunway(runway));
    
    // Create default weather
    const defaultWeather: InsertWeather = {
      temperature: 25.0,
      feelsLike: 27.0,
      humidity: 72.0,
      dewPoint: 19.0,
      visibility: 5.2,
      qnh: 1013.0,
      windDirection: 270.0,
      windSpeed: 12.0,
      windGust: 18.0
    };
    
    this.createWeather(defaultWeather);
    
    // Create default equipment
    const equipmentList: InsertEquipment[] = [
      {
        name: "Sistema de Iluminação",
        type: "lighting",
        location: "Taxiway C - Circuito Central",
        status: "critical",
        details: { message: "Falha detectada: 14:25 - Equipe técnica notificada" }
      },
      {
        name: "Radar de Superfície",
        type: "radar",
        location: "Radar Primário - Torre Norte",
        status: "operational",
        details: { message: "Última verificação: 14:30 - Funcionamento normal" }
      },
      {
        name: "Sistema PAPI",
        type: "lighting",
        location: "Pista 27L",
        status: "operational",
        details: { message: "Intensidade: 100% - Próxima calibração: 25/05" }
      },
      {
        name: "Luzes de Aproximação",
        type: "lighting",
        location: "ALS Pista 09R",
        status: "operational",
        details: { message: "Funcionamento normal - Intensidade: 80%" }
      },
      {
        name: "ATIS",
        type: "communication",
        location: "Transmissão Automática",
        status: "operational",
        details: { message: "Info BRAVO ativa - Atualizado: 14:00Z" }
      },
      {
        name: "Gerador de Emergência",
        type: "power",
        location: "Gerador #2 - Terminal 3",
        status: "warning",
        details: { message: "Nível de combustível: 42% - Abastecimento agendado" }
      }
    ];
    
    equipmentList.forEach(eq => this.createEquipment(eq));
    
    // Create default incidents
    const incidents: InsertIncident[] = [
      {
        referenceId: "FOD-2775",
        title: "Detecção de FOD na pista 09R/27L",
        description: "Sistema de detecção automática identificou objeto metálico próximo à interseção com taxiway B. Dimensão estimada: 15cm.",
        severity: "critical",
        status: "Em análise",
        location: "09R/27L - Taxiway B",
        actions: [
          "Equipe de inspeção mobilizada - ETA: 3 min",
          "Notificação enviada para Torre de Controle",
          "Alerta de segurança emitido para aeronaves"
        ]
      },
      {
        referenceId: "WX-1125",
        title: "Alerta de tempestade aproximando-se",
        description: "Sistema de detecção de raios identificou atividade elétrica a 15km ao sul do aeroporto. Previsão de chuva e rajadas de vento nos próximos 30 minutos.",
        severity: "warning",
        status: "Monitorando",
        location: "Sul do aeroporto",
        actions: [
          "Monitoramento ativo com atualização a cada 5 minutos",
          "Prealerta enviado para equipes de pátio",
          "Plano de contingência meteorológica em standby"
        ]
      },
      {
        referenceId: "EQP-3382",
        title: "Falha no sistema de iluminação Taxiway C",
        description: "Falha detectada no circuito central de iluminação da Taxiway C. Aproximadamente 12 luzes afetadas. Equipe técnica notificada.",
        severity: "critical",
        status: "Em reparo",
        location: "Taxiway C",
        actions: [
          "Equipe técnica enviada ao local - ETA: 10 min",
          "Circuito de backup ativado",
          "Notificação enviada a todas as aeronaves em solo"
        ]
      },
      {
        referenceId: "OPS-5521",
        title: "Inspeção de rotina da pista 09L/27R concluída",
        description: "Inspeção visual e instrumental concluída sem identificação de problemas. Coeficiente de atrito medido: 0.78 (dentro dos parâmetros).",
        severity: "info",
        status: "Concluído",
        location: "Pista 09L/27R",
        actions: [
          "Relatório arquivado no sistema",
          "Próxima inspeção agendada para 19/05 às 08:00"
        ]
      }
    ];
    
    incidents.forEach(incident => this.createIncident(incident));
    
    // Create default weather alerts
    const weatherAlerts: InsertWeatherAlert[] = [
      {
        type: "warning",
        title: "Alerta de Tempestade",
        description: "Atividade elétrica detectada a 15km ao sul. Previsão de chegada em 25-30 min.",
        icon: "flash_on",
        active: true
      },
      {
        type: "info",
        title: "Precipitação",
        description: "Chuva fraca prevista para as próximas 2 horas. Acumulado esperado: 2-5mm.",
        icon: "water_drop",
        active: true
      }
    ];
    
    weatherAlerts.forEach(alert => this.createWeatherAlert(alert));
    
    // Create default critical alert
    const criticalAlert: InsertCriticalAlert = {
      message: "Detecção de objeto estranho (FOD) na pista 09R/27L - Equipe de inspeção mobilizada - ETA: 3 min"
    };
    
    this.createCriticalAlert(criticalAlert);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCounter++;
    const user: User = { ...insertUser, id, lastLogin: null, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Runway operations
  async getRunway(id: number): Promise<Runway | undefined> {
    return this.runways.get(id);
  }
  
  async getAllRunways(): Promise<Runway[]> {
    return Array.from(this.runways.values());
  }
  
  async createRunway(insertRunway: InsertRunway): Promise<Runway> {
    const id = this.runwayCounter++;
    const now = new Date();
    const runway: Runway = { ...insertRunway, id, lastUpdated: now };
    this.runways.set(id, runway);
    return runway;
  }
  
  async updateRunway(id: number, data: Partial<InsertRunway>): Promise<Runway> {
    const runway = await this.getRunway(id);
    if (!runway) {
      throw new Error(`Runway with id ${id} not found`);
    }
    
    const updatedRunway: Runway = {
      ...runway,
      ...data,
      lastUpdated: new Date()
    };
    
    this.runways.set(id, updatedRunway);
    return updatedRunway;
  }
  
  // Weather operations
  async getLatestWeather(): Promise<Weather | undefined> {
    const entries = Array.from(this.weatherEntries.values());
    if (entries.length === 0) return undefined;
    
    // Sort by timestamp in descending order and get the most recent
    return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }
  
  async createWeather(insertWeather: InsertWeather): Promise<Weather> {
    const id = this.weatherCounter++;
    const now = new Date();
    const weatherEntry: Weather = { ...insertWeather, id, timestamp: now };
    this.weatherEntries.set(id, weatherEntry);
    return weatherEntry;
  }
  
  async getWeatherHistory(limit: number): Promise<Weather[]> {
    const entries = Array.from(this.weatherEntries.values());
    return entries
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  // Equipment operations
  async getEquipment(id: number): Promise<Equipment | undefined> {
    return this.equipmentEntries.get(id);
  }
  
  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipmentEntries.values());
  }
  
  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const id = this.equipmentCounter++;
    const now = new Date();
    const equipment: Equipment = { 
      ...insertEquipment, 
      id, 
      lastMaintenanceDate: null, 
      nextMaintenanceDate: null,
      lastUpdated: now 
    };
    this.equipmentEntries.set(id, equipment);
    return equipment;
  }
  
  async updateEquipment(id: number, data: Partial<InsertEquipment>): Promise<Equipment> {
    const equipment = await this.getEquipment(id);
    if (!equipment) {
      throw new Error(`Equipment with id ${id} not found`);
    }
    
    const updatedEquipment: Equipment = {
      ...equipment,
      ...data,
      lastUpdated: new Date()
    };
    
    this.equipmentEntries.set(id, updatedEquipment);
    return updatedEquipment;
  }
  
  // Incident operations
  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidentEntries.get(id);
  }
  
  async getIncidentByReference(referenceId: string): Promise<Incident | undefined> {
    return Array.from(this.incidentEntries.values()).find(
      (incident) => incident.referenceId === referenceId
    );
  }
  
  async getAllIncidents(): Promise<Incident[]> {
    return Array.from(this.incidentEntries.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.incidentCounter++;
    const now = new Date();
    const incident: Incident = { 
      ...insertIncident, 
      id,
      reportedBy: null, 
      timestamp: now 
    };
    this.incidentEntries.set(id, incident);
    return incident;
  }
  
  async updateIncident(id: number, data: Partial<InsertIncident>): Promise<Incident> {
    const incident = await this.getIncident(id);
    if (!incident) {
      throw new Error(`Incident with id ${id} not found`);
    }
    
    const updatedIncident: Incident = {
      ...incident,
      ...data
    };
    
    this.incidentEntries.set(id, updatedIncident);
    return updatedIncident;
  }
  
  // Weather alert operations
  async getWeatherAlert(id: number): Promise<WeatherAlert | undefined> {
    return this.weatherAlertEntries.get(id);
  }
  
  async getAllWeatherAlerts(): Promise<WeatherAlert[]> {
    return Array.from(this.weatherAlertEntries.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getActiveWeatherAlerts(): Promise<WeatherAlert[]> {
    return Array.from(this.weatherAlertEntries.values())
      .filter(alert => alert.active)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async createWeatherAlert(insertAlert: InsertWeatherAlert): Promise<WeatherAlert> {
    const id = this.weatherAlertCounter++;
    const now = new Date();
    const alert: WeatherAlert = { ...insertAlert, id, timestamp: now };
    this.weatherAlertEntries.set(id, alert);
    return alert;
  }
  
  async deactivateWeatherAlert(id: number): Promise<WeatherAlert> {
    const alert = await this.getWeatherAlert(id);
    if (!alert) {
      throw new Error(`Weather alert with id ${id} not found`);
    }
    
    const updatedAlert: WeatherAlert = {
      ...alert,
      active: false
    };
    
    this.weatherAlertEntries.set(id, updatedAlert);
    return updatedAlert;
  }
  
  // Critical alert operations
  async getCriticalAlert(id: number): Promise<CriticalAlert | undefined> {
    return this.criticalAlertEntries.get(id);
  }
  
  async getAllCriticalAlerts(): Promise<CriticalAlert[]> {
    return Array.from(this.criticalAlertEntries.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getActiveCriticalAlert(): Promise<CriticalAlert | undefined> {
    return Array.from(this.criticalAlertEntries.values())
      .find(alert => !alert.acknowledged);
  }
  
  async createCriticalAlert(insertAlert: InsertCriticalAlert): Promise<CriticalAlert> {
    const id = this.criticalAlertCounter++;
    const now = new Date();
    const alert: CriticalAlert = { 
      ...insertAlert, 
      id, 
      acknowledged: false,
      timestamp: now 
    };
    this.criticalAlertEntries.set(id, alert);
    return alert;
  }
  
  async acknowledgeCriticalAlert(id: number): Promise<CriticalAlert> {
    const alert = await this.getCriticalAlert(id);
    if (!alert) {
      throw new Error(`Critical alert with id ${id} not found`);
    }
    
    const updatedAlert: CriticalAlert = {
      ...alert,
      acknowledged: true
    };
    
    this.criticalAlertEntries.set(id, updatedAlert);
    return updatedAlert;
  }
}

export const storage = new MemStorage();
