import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useDashboard } from "@/contexts/dashboard-context";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  BarChart,
  Bar
} from "recharts";
import { cn } from "@/lib/utils";

export default function Runways() {
  const { 
    runwayData, 
    temperatureData, 
    frictionData, 
    currentTime,
    notificationCount
  } = useDashboard();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRunway, setSelectedRunway] = useState("all");
  
  useEffect(() => {
    document.title = "GRU IOT - Runway Monitoring";
  }, []);

  const formattedTime = format(currentTime, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });
  
  // Mock historical data for 24h charts
  const temperatureHistorical = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    "09R": 27 + Math.random() * 3 - 1.5,
    "27L": 28 + Math.random() * 3 - 1.5,
    "09L": 27.5 + Math.random() * 3 - 1.5,
  })).reverse();
  
  const frictionHistorical = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    "09R": 0.82 + Math.random() * 0.06 - 0.03,
    "27L": 0.79 + Math.random() * 0.06 - 0.03,
    "09L": 0.78 + Math.random() * 0.06 - 0.03,
  })).reverse();
  
  const precipitationHistorical = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    "09R": Math.random() * 2,
    "27L": Math.random() * 2,
    "09L": Math.random() * 2,
  })).reverse();
  
  // FOD detection history
  const fodDetectionData = [
    { date: "03/05", count: 3 },
    { date: "04/05", count: 1 },
    { date: "05/05", count: 0 },
    { date: "06/05", count: 2 },
    { date: "07/05", count: 1 },
    { date: "08/05", count: 0 },
    { date: "09/05", count: 1 },
    { date: "10/05", count: 0 },
    { date: "11/05", count: 2 },
    { date: "12/05", count: 1 },
  ];
  
  // Mock FOD detection logs
  const fodDetectionLogs = [
    { id: "FOD-2775", timestamp: "14:32 - 18/05/2023", location: "09R/27L próximo à Taxiway B", size: "15cm", material: "Metálico", status: "Removido" },
    { id: "FOD-2774", timestamp: "09:17 - 18/05/2023", location: "27L próximo à cabeceira", size: "5cm", material: "Plástico", status: "Removido" },
    { id: "FOD-2773", timestamp: "21:45 - 17/05/2023", location: "09L/27R meio da pista", size: "8cm", material: "Borracha", status: "Removido" },
    { id: "FOD-2772", timestamp: "15:22 - 16/05/2023", location: "09R 200m da cabeceira", size: "3cm", material: "Metálico", status: "Removido" },
    { id: "FOD-2771", timestamp: "10:38 - 16/05/2023", location: "09L próximo ao taxiway A", size: "10cm", material: "Tecido", status: "Removido" }
  ];
  
  // Runway condition metrics
  const runwayConditions = [
    { name: "09R/27L", status: "Operational", lastInspection: "18/05 - 06:30", nextInspection: "19/05 - 06:30", remarks: "Sem observações" },
    { name: "09L/27R", status: "Operational", lastInspection: "18/05 - 07:00", nextInspection: "19/05 - 07:00", remarks: "Marcações para repintura em 30 dias" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operador"
        currentRoute="/pistas"
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Runway Monitoring</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Real-time monitoring of airport runway conditions</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <select 
              value={selectedRunway}
              onChange={(e) => setSelectedRunway(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-800 rounded-md border-none p-2 text-sm"
            >
              <option value="all">All runways</option>
              <option value="09R">Runway 09R/27L</option>
              <option value="09L">Runway 09L/27R</option>
            </select>
            
            <Button size="sm" variant="outline" className="bg-neutral-100 dark:bg-neutral-800">
              <span className="material-icons text-sm mr-1">print</span>
              Report
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="friction">Friction Coefficient</TabsTrigger>
            <TabsTrigger value="foddetection">FOD Detection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Aerial View of Runways</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-96 rounded-lg overflow-hidden bg-neutral-100 dark:bg-darkbg-card">
                    <img 
                      src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
                      alt="Aerial view of airport runways" 
                      className="w-full h-full object-cover opacity-70 dark:opacity-50"
                    />
                    
                    {/* Overlay elements */}
                    <div className="absolute top-0 left-0 right-0 bottom-0">
                      {runwayData.alertPoints.map((point, index) => (
                        <div 
                          key={index}
                          className={`absolute h-4 w-4 rounded-full animate-pulse ${
                            point.status === 'critical' ? 'bg-critical' : 
                            point.status === 'warning' ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ top: `${point.y}%`, left: `${point.x}%` }}
                        />
                      ))}
                      
                      {/* Runway labels */}
                      <div className="absolute top-1/4 left-1/4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        09R
                      </div>
                      <div className="absolute top-1/4 right-1/4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        27L
                      </div>
                      <div className="absolute bottom-1/3 left-1/3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        09L
                      </div>
                      <div className="absolute bottom-1/3 right-1/3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        27R
                      </div>
                    </div>
                    
                    {/* Controls */}
                    <div className="absolute bottom-2 right-2 flex space-x-1">
                      <Button size="icon" className="bg-white dark:bg-neutral-800 p-1 rounded-full shadow h-7 w-7">
                        <span className="material-icons text-sm">add</span>
                      </Button>
                      <Button size="icon" className="bg-white dark:bg-neutral-800 p-1 rounded-full shadow h-7 w-7">
                        <span className="material-icons text-sm">remove</span>
                      </Button>
                      <Button size="icon" className="bg-white dark:bg-neutral-800 p-1 rounded-full shadow h-7 w-7">
                        <span className="material-icons text-sm">layers</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Runway Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {runwayConditions.map((runway, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{runway.name}</h3>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success bg-opacity-20 text-success">
                            {runway.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400">Last inspection:</span>
                            <span className="ml-2">{runway.lastInspection}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 dark:text-neutral-400">Next inspection:</span>
                            <span className="ml-2">{runway.nextInspection}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-neutral-500 dark:text-neutral-400">Notes:</span>
                          <span className="ml-2">{runway.remarks}</span>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg text-center">
                        <div className="text-xs text-neutral-500 mb-1">Temperature</div>
                        <div className="font-mono text-sm">09R: {temperatureData.runways[0].temperature}</div>
                        <div className="font-mono text-sm">27L: {temperatureData.runways[1].temperature}</div>
                      </div>
                      
                      <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg text-center">
                        <div className="text-xs text-neutral-500 mb-1">Friction Coef.</div>
                        <div className="font-mono text-sm">09R: {frictionData.runways[0].friction}</div>
                        <div className="font-mono text-sm">27L: {frictionData.runways[1].friction}</div>
                      </div>
                      
                      <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg text-center">
                        <div className="text-xs text-neutral-500 mb-1">Precipitation</div>
                        <div className="font-mono text-sm">09R: 0.0 mm/h</div>
                        <div className="font-mono text-sm">27L: 0.0 mm/h</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="temperature" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Asphalt Temperature (°C) - Last 24 hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={temperatureHistorical}
                      margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[20, 35]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="09R" stroke="#1A73E8" name="Pista 09R/27L" />
                      <Line type="monotone" dataKey="09L" stroke="#F9A825" name="Pista 09L/27R" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Temperatura Atual por Seção - 09R/27L</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 09R</div>
                        <div className="font-mono">{(27.2 + Math.random() * 0.5).toFixed(1)}°C</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Meio</div>
                        <div className="font-mono">{(27.8 + Math.random() * 0.5).toFixed(1)}°C</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 27L</div>
                        <div className="font-mono">{(28.3 + Math.random() * 0.5).toFixed(1)}°C</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Temperatura Atual por Seção - 09L/27R</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 09L</div>
                        <div className="font-mono">{(27.5 + Math.random() * 0.5).toFixed(1)}°C</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Meio</div>
                        <div className="font-mono">{(28.0 + Math.random() * 0.5).toFixed(1)}°C</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 27R</div>
                        <div className="font-mono">{(28.2 + Math.random() * 0.5).toFixed(1)}°C</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="friction" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Friction Coefficient - Last 24 hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={frictionHistorical}
                      margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0.7, 0.9]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="09R" stroke="#1A73E8" name="Pista 09R/27L" />
                      <Line type="monotone" dataKey="09L" stroke="#F9A825" name="Pista 09L/27R" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Atrito Atual por Seção - 09R/27L</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 09R</div>
                        <div className="font-mono">{(0.81 + Math.random() * 0.03).toFixed(2)}</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Meio</div>
                        <div className="font-mono">{(0.83 + Math.random() * 0.03).toFixed(2)}</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 27L</div>
                        <div className="font-mono">{(0.82 + Math.random() * 0.03).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Atrito Atual por Seção - 09L/27R</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 09L</div>
                        <div className="font-mono">{(0.79 + Math.random() * 0.03).toFixed(2)}</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Meio</div>
                        <div className="font-mono">{(0.78 + Math.random() * 0.03).toFixed(2)}</div>
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="text-xs text-neutral-500">Cabeceira 27R</div>
                        <div className="font-mono">{(0.77 + Math.random() * 0.03).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 rounded-lg bg-neutral-50 dark:bg-darkbg-card">
                  <h3 className="text-sm font-medium mb-2">Padrões de Segurança</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-2">
                      <div className="text-xs text-neutral-500 mb-1">Nível Ideal</div>
                      <div className="flex items-center">
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-success h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="ml-2 text-sm">≥ 0.80</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs text-neutral-500 mb-1">Nível de Precaução</div>
                      <div className="flex items-center">
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-warning h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="ml-2 text-sm">≥ 0.75</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs text-neutral-500 mb-1">Nível de Alerta</div>
                      <div className="flex items-center">
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-critical h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="ml-2 text-sm">{"< 0.75"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="foddetection" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Histórico de Detecção de FOD</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={fodDetectionData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#1A73E8" name="Detecções FOD" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500">Total (10 dias)</div>
                      <div className="text-xl font-medium">11</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500">Média diária</div>
                      <div className="text-xl font-medium">1.1</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500">Tendência</div>
                      <div className="text-xl font-medium text-success flex justify-center items-center">
                        <span className="material-icons text-sm mr-1">arrow_downward</span>
                        -15%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Registro de Detecções FOD</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <th className="text-left font-medium py-2 pl-2">ID</th>
                          <th className="text-left font-medium py-2">Timestamp</th>
                          <th className="text-left font-medium py-2">Localização</th>
                          <th className="text-left font-medium py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fodDetectionLogs.map((log, index) => (
                          <tr 
                            key={index} 
                            className={cn(
                              "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                              index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                            )}
                          >
                            <td className="py-2 pl-2">{log.id}</td>
                            <td className="py-2">{log.timestamp}</td>
                            <td className="py-2">{log.location}</td>
                            <td className="py-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success bg-opacity-20 text-success">
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <Button variant="link" className="text-primary text-sm">
                      Ver todos os registros
                      <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sistema de Detecção FOD</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Status do Sistema</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Cobertura 09R/27L:</span>
                        <span className="ml-2 text-success">100%</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Cobertura 09L/27R:</span>
                        <span className="ml-2 text-success">100%</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Sensores ativos:</span>
                        <span className="ml-2">32/32</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Última verificação:</span>
                        <span className="ml-2">06:00 - 18/05</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Alertas de Manutenção</h3>
                    <div className="text-sm">
                      <div className="mb-1">
                        <span className="text-neutral-500 dark:text-neutral-400">Próxima calibração:</span>
                        <span className="ml-2">28/05/2023</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Observações:</span>
                        <span className="ml-2">Sistema funcionando dentro dos parâmetros normais.</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <h3 className="font-medium mb-4">Capacidade de Detecção</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Objetos metálicos &gt; 2cm</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Objetos não-metálicos &gt; 5cm</span>
                        <span>95%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Fragmentos de pneu</span>
                        <span>90%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Detecção em condições adversas</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-warning h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer 
        version="2.1.5" 
        lastUpdate="18/05/2023" 
      />
    </div>
  );
}