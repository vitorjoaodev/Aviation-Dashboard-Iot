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
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IncidentItem, IncidentSeverity } from "@/components/ui/incident-item";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Incidents() {
  const { 
    incidents, 
    currentTime,
    notificationCount,
    analysisData
  } = useDashboard();
  
  const [activeTab, setActiveTab] = useState("active");
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    document.title = "GRU IOT - Incident Management";
  }, []);

  const formattedTime = format(currentTime, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });
  
  // Filter incidents
  const filteredIncidents = React.useMemo(() => {
    if (filter === "all") return incidents;
    return incidents.filter(incident => incident.severity === filter);
  }, [incidents, filter]);
  
  // Selected incident data
  const selectedIncidentData = React.useMemo(() => {
    if (!selectedIncident) return null;
    return incidents.find(incident => incident.id === selectedIncident);
  }, [incidents, selectedIncident]);
  
  // Status counts
  const statusCounts = {
    critical: incidents.filter(inc => inc.severity === "critical").length,
    warning: incidents.filter(inc => inc.severity === "warning").length,
    info: incidents.filter(inc => inc.severity === "info").length
  };
  
  // Mock historical incidents data
  const pastIncidents = [
    { id: "FOD-2769", timestamp: "09:12 - 17/05/2023", title: "FOD reportado na pista 09R", severity: "warning" as IncidentSeverity, status: "Concluído" },
    { id: "OPS-5518", timestamp: "14:35 - 16/05/2023", title: "Aeronave reportou problemas com luzes de aproximação", severity: "critical" as IncidentSeverity, status: "Concluído" },
    { id: "WX-1122", timestamp: "10:28 - 16/05/2023", title: "Raios detectados a 8km - Atividades ao ar livre suspensas", severity: "critical" as IncidentSeverity, status: "Concluído" },
    { id: "EQP-3378", timestamp: "08:15 - 15/05/2023", title: "Falha no radar secundário - Backup ativado", severity: "warning" as IncidentSeverity, status: "Concluído" },
    { id: "OPS-5515", timestamp: "15:40 - 14/05/2023", title: "Inspeção de rotina concluída - Todas as pistas", severity: "info" as IncidentSeverity, status: "Concluído" },
    { id: "EQP-3375", timestamp: "11:22 - 14/05/2023", title: "Manutenção preventiva no sistema PAPI", severity: "info" as IncidentSeverity, status: "Concluído" },
  ];
  
  // Response protocol data
  const responseProtocols = [
    { id: "RP-001", name: "Protocolo FOD", type: "Segurança", description: "Procedimentos para detecção e remoção de objetos estranhos nas pistas", lastUpdated: "01/05/2023" },
    { id: "RP-002", name: "Protocolo Condições Meteorológicas Adversas", type: "Meteorologia", description: "Ações de mitigação para temporais, raios e visibilidade reduzida", lastUpdated: "15/04/2023" },
    { id: "RP-003", name: "Protocolo Falha de Equipamentos Críticos", type: "Técnico", description: "Procedimentos para falhas em sistemas de iluminação, radares e comunicação", lastUpdated: "03/05/2023" },
    { id: "RP-004", name: "Protocolo Evacuação de Emergência", type: "Segurança", description: "Procedimentos para evacuação de áreas específicas do aeroporto", lastUpdated: "28/04/2023" },
    { id: "RP-005", name: "Protocolo Falha de Energia", type: "Técnico", description: "Ações para falhas no sistema principal de energia e ativação de backups", lastUpdated: "10/05/2023" },
  ];
  
  // Emergency contacts
  const emergencyContacts = [
    { name: "Centro de Operações Aeroportuárias", phone: "11 2445-2945", email: "cop@guarulhos.aero", responseTime: "Imediato" },
    { name: "Equipe Técnica (24h)", phone: "11 2445-3050", email: "tecnico@guarulhos.aero", responseTime: "< 5 min" },
    { name: "Manutenção", phone: "11 2445-3122", email: "manutencao@guarulhos.aero", responseTime: "< 15 min" },
    { name: "Corpo de Bombeiros", phone: "11 2445-2988", email: "bombeiros@guarulhos.aero", responseTime: "< 3 min" },
    { name: "Segurança", phone: "11 2445-2999", email: "seguranca@guarulhos.aero", responseTime: "< 5 min" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operador"
        currentRoute="/incidentes"
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Gerenciamento de Incidentes</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Monitoramento e gestão de incidentes operacionais do aeroporto</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button>
              <span className="material-icons text-sm mr-1">add</span>
              Novo Incidente
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status de Incidentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Críticos", value: statusCounts.critical, color: "#F44336" },
                        { name: "Atenção", value: statusCounts.warning, color: "#FFC107" },
                        { name: "Informativos", value: statusCounts.info, color: "#607D8B" }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                      labelLine={false}
                    >
                      {[
                        { name: "Críticos", value: statusCounts.critical, color: "#F44336" },
                        { name: "Atenção", value: statusCounts.warning, color: "#FFC107" },
                        { name: "Informativos", value: statusCounts.info, color: "#607D8B" }
                      ].map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Críticos</div>
                  <div className="font-medium text-critical">{statusCounts.critical}</div>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Atenção</div>
                  <div className="font-medium text-warning">{statusCounts.warning}</div>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Informativos</div>
                  <div className="font-medium text-neutral-500">{statusCounts.info}</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium mb-1">Tempo médio de resposta</h3>
                  <span className="text-sm">{analysisData.responseTimeStats.average} min</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                  <div 
                    className={cn(
                      "h-2.5 rounded-full",
                      analysisData.responseTimeStats.average <= analysisData.responseTimeStats.target
                        ? "bg-success"
                        : "bg-warning"
                    )}
                    style={{ width: `${(analysisData.responseTimeStats.average / analysisData.responseTimeStats.target) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between text-xs text-neutral-500">
                  <span>Meta: {analysisData.responseTimeStats.target} min</span>
                  <span>Melhor: {analysisData.responseTimeStats.best} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Incidentes Ativos</CardTitle>
                <div className="flex items-center space-x-2">
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-neutral-100 dark:bg-neutral-800 rounded-md border-none py-1 pl-2 pr-4 text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="critical">Críticos</option>
                    <option value="warning">Atenção</option>
                    <option value="info">Informativos</option>
                  </select>
                  <Button size="icon" variant="outline" className="p-1 bg-neutral-100 dark:bg-neutral-800">
                    <span className="material-icons text-sm">filter_list</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-5 pb-2">
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map(incident => (
                    <IncidentItem
                      key={incident.id}
                      timestamp={incident.timestamp}
                      title={incident.title}
                      description={incident.description}
                      severity={incident.severity}
                      id={incident.id}
                      onViewDetails={(id) => setSelectedIncident(id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <span className="material-icons text-3xl text-neutral-400 mb-2">check_circle</span>
                    <p>Nenhum incidente ativo com os filtros atuais.</p>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Button variant="link" className="text-primary">Carregar mais</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="active">Todos os Incidentes</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="protocols">Protocolos de Resposta</TabsTrigger>
            <TabsTrigger value="analysis">Análise</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Lista de Incidentes</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <span className="material-icons text-neutral-400 text-sm">search</span>
                      </span>
                      <input
                        className="bg-neutral-100 dark:bg-neutral-800 py-1 pl-8 pr-4 rounded-md w-64 text-sm placeholder:text-neutral-400"
                        placeholder="Buscar incidente..."
                        type="text"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-neutral-100 dark:bg-neutral-800"
                    >
                      <span className="material-icons text-sm mr-1">file_download</span>
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left font-medium py-2 px-2">ID</th>
                        <th className="text-left font-medium py-2 px-2">Timestamp</th>
                        <th className="text-left font-medium py-2 px-2">Título</th>
                        <th className="text-left font-medium py-2 px-2">Severidade</th>
                        <th className="text-left font-medium py-2 px-2">Status</th>
                        <th className="text-left font-medium py-2 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map((incident, index) => (
                        <tr 
                          key={index} 
                          className={cn(
                            "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                            index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                          )}
                        >
                          <td className="py-2 px-2">{incident.id}</td>
                          <td className="py-2 px-2">{incident.timestamp}</td>
                          <td className="py-2 px-2 max-w-[300px] truncate">{incident.title}</td>
                          <td className="py-2 px-2">
                            <Badge
                              className={cn(
                                incident.severity === "critical" 
                                  ? "bg-critical" 
                                  : incident.severity === "warning" 
                                    ? "bg-warning text-black" 
                                    : "bg-neutral-500"
                              )}
                            >
                              {incident.severity === "critical" ? "Crítico" : incident.severity === "warning" ? "Atenção" : "Informativo"}
                            </Badge>
                          </td>
                          <td className="py-2 px-2">{incident.status || "Em análise"}</td>
                          <td className="py-2 px-2">
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <span className="material-icons text-sm">visibility</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <span className="material-icons text-sm">edit</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Mapa de Incidentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 rounded-lg overflow-hidden bg-neutral-100 dark:bg-darkbg-card">
                  <img 
                    src="https://images.unsplash.com/photo-1544950471-e5916b5c36bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
                    alt="Mapa do aeroporto com incidentes" 
                    className="w-full h-full object-cover opacity-70 dark:opacity-50"
                  />
                  
                  {/* Overlay elements - incident locations */}
                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    {/* Simulated incident locations */}
                    <div className="absolute top-[30%] left-[40%]">
                      <div className="relative">
                        <span className="material-icons text-critical animate-pulse">warning</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          Detecção FOD
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-[60%] left-[30%]">
                      <div className="relative">
                        <span className="material-icons text-critical">warning</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          Falha iluminação
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-[25%] left-[70%]">
                      <div className="relative">
                        <span className="material-icons text-warning">warning</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          Alerta tempestade
                        </div>
                      </div>
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
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Histórico de Incidentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <th className="text-left font-medium py-2 px-2">ID</th>
                          <th className="text-left font-medium py-2 px-2">Timestamp</th>
                          <th className="text-left font-medium py-2 px-2">Título</th>
                          <th className="text-left font-medium py-2 px-2">Severidade</th>
                          <th className="text-left font-medium py-2 px-2">Status</th>
                          <th className="text-left font-medium py-2 px-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pastIncidents.map((incident, index) => (
                          <tr 
                            key={index} 
                            className={cn(
                              "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                              index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                            )}
                          >
                            <td className="py-2 px-2">{incident.id}</td>
                            <td className="py-2 px-2">{incident.timestamp}</td>
                            <td className="py-2 px-2 max-w-[300px] truncate">{incident.title}</td>
                            <td className="py-2 px-2">
                              <Badge
                                className={cn(
                                  incident.severity === "critical" 
                                    ? "bg-critical" 
                                    : incident.severity === "warning" 
                                      ? "bg-warning text-black" 
                                      : "bg-neutral-500"
                                )}
                              >
                                {incident.severity === "critical" ? "Crítico" : incident.severity === "warning" ? "Atenção" : "Informativo"}
                              </Badge>
                            </td>
                            <td className="py-2 px-2">{incident.status}</td>
                            <td className="py-2 px-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                <span className="material-icons text-sm mr-1">description</span>
                                Relatório
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-neutral-500">
                      Mostrando 6 de 124 registros
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                        <span className="material-icons text-sm">chevron_left</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-primary text-white">
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                        2
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                        3
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                        <span className="material-icons text-sm">more_horiz</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                        <span className="material-icons text-sm">chevron_right</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tendência de Incidentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analysisData.incidentTrend}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="critical" stroke="#D50000" name="Crítico" />
                        <Line type="monotone" dataKey="warning" stroke="#F9A825" name="Atenção" />
                        <Line type="monotone" dataKey="info" stroke="#616E7C" name="Info" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Estatísticas do Período</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total de incidentes:</span>
                        <span>{analysisData.totalIncidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incidentes críticos:</span>
                        <span>{analysisData.incidentsByCategory.find(i => i.name === "FOD")?.value || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tendência:</span>
                        <span className="text-success flex items-center">
                          <span className="material-icons text-sm mr-1">arrow_downward</span>
                          -12%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categorias de Incidentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="col-span-1">
                    <div className="h-48 flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analysisData.incidentsByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={1}
                            dataKey="value"
                          >
                            {analysisData.incidentsByCategory.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} (${((value as number / analysisData.totalIncidents) * 100).toFixed(0)}%)`, name]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {analysisData.incidentsByCategory.map((category, index) => (
                        <div key={index} className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg text-center">
                          <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: category.color }}></div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xl mt-1">{category.value}</div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {((category.value / analysisData.totalIncidents) * 100).toFixed(0)}% do total
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Incidentes por Localização</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Pista 09R/27L</span>
                              <span>42%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Pista 09L/27R</span>
                              <span>28%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '28%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Taxiways</span>
                              <span>18%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '18%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Outros</span>
                              <span>12%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                        <h3 className="font-medium mb-3">Principais Causas</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Condições meteorológicas</span>
                              <span>35%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Falhas de equipamentos</span>
                              <span>30%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Objetos estranhos</span>
                              <span>25%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Erros operacionais</span>
                              <span>10%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="protocols" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Contatos de Emergência</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {emergencyContacts.map((contact, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "p-3 rounded-lg border-l-4 border-primary",
                          index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : "bg-white dark:bg-neutral-800"
                        )}
                      >
                        <div className="font-medium">{contact.name}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
                          <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                            <span className="material-icons text-sm mr-1">phone</span>
                            <span>{contact.phone}</span>
                          </div>
                          <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                            <span className="material-icons text-sm mr-1">email</span>
                            <span>{contact.email}</span>
                          </div>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          Tempo de resposta esperado: {contact.responseTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Protocolos de Resposta</CardTitle>
                    <Button variant="outline" size="sm" className="bg-neutral-100 dark:bg-neutral-800">
                      <span className="material-icons text-sm mr-1">add</span>
                      Novo Protocolo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {responseProtocols.map((protocol, index) => (
                      <div key={index} className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{protocol.name}</h3>
                            <div className="text-sm text-neutral-600 dark:text-neutral-300">Tipo: {protocol.type}</div>
                          </div>
                          <Badge className="bg-primary">{protocol.id}</Badge>
                        </div>
                        <p className="text-sm mb-3">{protocol.description}</p>
                        <div className="flex justify-between items-center text-sm">
                          <div className="text-neutral-500">
                            Atualizado: {protocol.lastUpdated}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <span className="material-icons text-sm mr-1">visibility</span>
                              Ver
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <span className="material-icons text-sm mr-1">edit</span>
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Procedimentos de Emergência</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="fod" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="fod">FOD</TabsTrigger>
                    <TabsTrigger value="weather">Condições Meteorológicas</TabsTrigger>
                    <TabsTrigger value="equipment">Falhas de Equipamentos</TabsTrigger>
                    <TabsTrigger value="evacuation">Evacuação</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="fod" className="space-y-4">
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Protocolo para Detecção de FOD</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">1. Detecção e Avaliação</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Confirmar a detecção visual ou por radar de FOD</li>
                            <li>Classificar tamanho, localização e risco potencial</li>
                            <li>Notificar Torre de Controle imediatamente</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">2. Resposta Imediata</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Suspender operações na área afetada conforme necessário</li>
                            <li>Despachar equipe de inspeção/remoção - tempo alvo: 3 min</li>
                            <li>Registrar incidente no sistema e iniciar comunicações</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">3. Remoção e Verificação</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Remover objeto seguindo procedimentos de segurança</li>
                            <li>Verificar área circundante para detecção de objetos adicionais</li>
                            <li>Documentar objeto removido (fotos, dimensões, material)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">4. Retomada de Operações</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Confirmar área segura e livre de obstáculos</li>
                            <li>Autorizar retomada de operações</li>
                            <li>Atualizar status no sistema e finalizar registro do incidente</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button>
                          <span className="material-icons text-sm mr-1">play_arrow</span>
                          Iniciar Procedimento
                        </Button>
                        <Button variant="outline">
                          <span className="material-icons text-sm mr-1">file_download</span>
                          Baixar Protocolo
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="weather">
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Protocolo para Condições Meteorológicas Adversas</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">1. Monitoramento</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Acompanhar alertas de radar meteorológico e sistema de detecção de raios</li>
                            <li>Avaliar distância, direção e velocidade das células de tempestade</li>
                            <li>Monitorar visibilidade, teto, direção e velocidade do vento</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">2. Raios - Alertas e Ações</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Alerta Amarelo (≤ 25km): Equipes em alerta</li>
                            <li>Alerta Laranja (≤ 12km): Suspender operações expostas, implementar restrições</li>
                            <li>Alerta Vermelho (≤ 5km): Suspender todas as operações externas, evacuar áreas expostas</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">3. Ventos Fortes e Reduções de Visibilidade</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Implementar restrições operacionais conforme limites estabelecidos</li>
                            <li>Comunicar condições e restrições a todas as aeronaves e veículos</li>
                            <li>Verificar objetos soltos e equipamentos em áreas expostas</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="equipment">
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Protocolo para Falhas de Equipamentos Críticos</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">1. Detecção e Classificação</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Identificar o equipamento afetado e verificar natureza da falha</li>
                            <li>Classificar a criticidade conforme impacto operacional</li>
                            <li>Verificar disponibilidade de sistemas redundantes/backup</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">2. Resposta Imediata</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Ativar sistemas redundantes se disponíveis</li>
                            <li>Notificar operadores e equipes técnicas apropriadas</li>
                            <li>Implementar limitações operacionais conforme necessário</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">3. Reparo e Verificação</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Despachar equipe técnica especializada</li>
                            <li>Realizar diagnóstico e implementar reparo</li>
                            <li>Realizar testes para verificar funcionalidade</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="evacuation">
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Protocolo de Evacuação de Emergência</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">1. Avaliação e Ativação</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Identificar o tipo e extensão da emergência</li>
                            <li>Determinar áreas afetadas e necessidade de evacuação</li>
                            <li>Ativar alertas e sistemas de notificação</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">2. Procedimentos de Evacuação</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Comunicar instruções claras por sistemas de anúncio</li>
                            <li>Orientar pessoas para rotas e pontos de encontro seguros</li>
                            <li>Deslocar agentes para pontos críticos para assistência</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-1">3. Contabilização e Verificação</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            <li>Realizar contagem em pontos de encontro</li>
                            <li>Verificar áreas evacuadas para confirmar ausência de pessoas</li>
                            <li>Comunicar situação para equipes de resposta a emergências</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Análise de Tendências</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { mes: "Jan", "2022": 35, "2023": 28 },
                          { mes: "Fev", "2022": 42, "2023": 31 },
                          { mes: "Mar", "2022": 28, "2023": 24 },
                          { mes: "Abr", "2022": 37, "2023": 30 },
                          { mes: "Mai", "2022": 40, "2023": 33 }
                        ]}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="2022" fill="#1A73E8" name="2022" />
                        <Bar dataKey="2023" fill="#34A853" name="2023" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Comparativo Anual</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total 2022 (Jan-Mai):</span>
                        <span>182 incidentes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total 2023 (Jan-Mai):</span>
                        <span>146 incidentes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variação:</span>
                        <span className="text-success flex items-center">
                          <span className="material-icons text-sm mr-1">arrow_downward</span>
                          -19.8%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tempo de Resposta por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analysisData.responseTime}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 6]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1A73E8" name="Minutos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Estatísticas de Resolução</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Tempo médio de resposta:</span>
                        <span>{analysisData.responseTimeStats.average} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Meta de resposta:</span>
                        <span>{analysisData.responseTimeStats.target} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Melhor tempo:</span>
                        <span>{analysisData.responseTimeStats.best} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Performance vs meta:</span>
                        <span className="text-success">86%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Matriz de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Classificação de Riscos</h3>
                      <div className="space-y-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 rounded">
                          <div className="font-medium">Crítico</div>
                          <div className="text-sm">Impacto alto, probabilidade alta</div>
                        </div>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 dark:bg-opacity-20 rounded">
                          <div className="font-medium">Alto</div>
                          <div className="text-sm">Impacto alto, probabilidade média</div>
                        </div>
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 rounded">
                          <div className="font-medium">Moderado</div>
                          <div className="text-sm">Impacto médio, probabilidade média</div>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20 rounded">
                          <div className="font-medium">Baixo</div>
                          <div className="text-sm">Impacto baixo ou probabilidade baixa</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Matriz de Risco - Principais Incidentes</h3>
                      
                      <div className="relative">
                        {/* Matriz 3x3 */}
                        <div className="grid grid-cols-3 gap-1">
                          {/* Probabilidades: Alta, Média, Baixa */}
                          {/* Impactos: Alto, Médio, Baixo */}
                          
                          {/* Alta probabilidade */}
                          <div className="h-24 p-2 bg-red-500 bg-opacity-80 dark:bg-opacity-50 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-white text-center text-xs">
                            Alto Impacto<br/>Alta Probabilidade
                          </div>
                          <div className="h-24 p-2 bg-orange-500 bg-opacity-70 dark:bg-opacity-40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Médio Impacto<br/>Alta Probabilidade
                          </div>
                          <div className="h-24 p-2 bg-yellow-500 bg-opacity-70 dark:bg-opacity-40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Baixo Impacto<br/>Alta Probabilidade
                          </div>
                          
                          {/* Média probabilidade */}
                          <div className="h-24 p-2 bg-orange-500 bg-opacity-70 dark:bg-opacity-40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Alto Impacto<br/>Média Probabilidade
                          </div>
                          <div className="h-24 p-2 bg-yellow-500 bg-opacity-70 dark:bg-opacity-40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Médio Impacto<br/>Média Probabilidade
                          </div>
                          <div className="h-24 p-2 bg-blue-500 bg-opacity-50 dark:bg-opacity-30 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Baixo Impacto<br/>Média Probabilidade
                          </div>
                          
                          {/* Baixa probabilidade */}
                          <div className="h-24 p-2 bg-yellow-500 bg-opacity-70 dark:bg-opacity-40 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Alto Impacto<br/>Baixa Probabilidade
                          </div>
                          <div className="h-24 p-2 bg-blue-500 bg-opacity-50 dark:bg-opacity-30 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Médio Impacto<br/>Baixa Probabilidade
                          </div>
                          <div className="h-24 p-2 bg-blue-500 bg-opacity-50 dark:bg-opacity-30 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-center text-xs">
                            Baixo Impacto<br/>Baixa Probabilidade
                          </div>
                        </div>
                        
                        {/* Indicadores de incidentes */}
                        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                          {/* FOD */}
                          <div className="absolute top-[20%] left-[15%]">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-darkbg-card shadow-md flex items-center justify-center font-medium text-xs">
                              FOD
                            </div>
                          </div>
                          
                          {/* Raios */}
                          <div className="absolute top-[15%] left-[50%]">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-darkbg-card shadow-md flex items-center justify-center font-medium text-xs">
                              Raios
                            </div>
                          </div>
                          
                          {/* Falha Equip. */}
                          <div className="absolute top-[30%] left-[25%]">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-darkbg-card shadow-md flex items-center justify-center font-medium text-xs">
                              Equip.
                            </div>
                          </div>
                          
                          {/* Visibilidade */}
                          <div className="absolute top-[40%] left-[60%]">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-darkbg-card shadow-md flex items-center justify-center font-medium text-xs">
                              Visib.
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 text-sm text-neutral-500">
                        Nota: Esta matriz representa a classificação atual de riscos com base nos incidentes históricos e probabilidades estimadas.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {selectedIncidentData && (
        <Dialog open={!!selectedIncident} onOpenChange={(open) => !open && setSelectedIncident(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Incidente</DialogTitle>
              <DialogDescription>
                ID: #{selectedIncidentData.id} | {selectedIncidentData.timestamp}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{selectedIncidentData.title}</h3>
                <p className="mt-2">{selectedIncidentData.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <div className="text-neutral-500 mb-1">Severidade</div>
                  <div className="font-medium">
                    {selectedIncidentData.severity === "critical" ? "Crítico" : 
                     selectedIncidentData.severity === "warning" ? "Atenção" : "Informativo"}
                  </div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  <div className="text-neutral-500 mb-1">Status</div>
                  <div className="font-medium">
                    {selectedIncidentData.status || "Em análise"}
                  </div>
                </div>
              </div>
              
              {selectedIncidentData.actions && (
                <div>
                  <h4 className="font-medium mb-2">Ações Tomadas</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedIncidentData.actions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setSelectedIncident(null)}>Fechar</Button>
              <Button variant="outline">Exportar Relatório</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Footer 
        version="2.1.5" 
        lastUpdate="18/05/2023" 
      />
    </div>
  );
}