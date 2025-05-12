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
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function Equipment() {
  const { 
    equipmentStatus, 
    currentTime,
    notificationCount,
    analysisData
  } = useDashboard();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("all");
  
  useEffect(() => {
    document.title = "GRU IOT - Equipment Monitoring";
  }, []);

  const formattedTime = format(currentTime, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });
  
  // Status counts for equipment
  const statusCounts = {
    operational: equipmentStatus.filter(eq => eq.status === "operational").length,
    warning: equipmentStatus.filter(eq => eq.status === "warning").length,
    critical: equipmentStatus.filter(eq => eq.status === "critical").length
  };
  
  const totalEquipment = equipmentStatus.length;
  
  // Equipment status data for chart
  const equipmentStatusData = [
    { name: "Operacional", value: statusCounts.operational, color: "#4CAF50" },
    { name: "Atenção", value: statusCounts.warning, color: "#FFC107" },
    { name: "Falha", value: statusCounts.critical, color: "#F44336" }
  ];
  
  // Mock data for historical uptime
  const uptimeHistory = Array.from({ length: 12 }, (_, i) => ({
    month: format(new Date(2023, i, 1), "MMM", { locale: ptBR }),
    uptime: 98 + Math.random() * 1.9
  }));
  
  // Mock data for maintenance history
  const maintenanceHistory = [
    { id: "MNT-4521", equipment: "Sistema PAPI - Pista 09R", date: "15/05/2023", type: "Preventiva", technician: "C. Silva", status: "Concluída" },
    { id: "MNT-4520", equipment: "Radar de Superfície - Torre Norte", date: "10/05/2023", type: "Calibração", technician: "M. Oliveira", status: "Concluída" },
    { id: "MNT-4519", equipment: "Sistema de Iluminação - Taxiway C", date: "08/05/2023", type: "Corretiva", technician: "J. Santos", status: "Concluída" },
    { id: "MNT-4518", equipment: "Gerador de Emergência #2", date: "03/05/2023", type: "Preventiva", technician: "R. Almeida", status: "Concluída" },
    { id: "MNT-4517", equipment: "Luzes de Aproximação - Pista 27L", date: "28/04/2023", type: "Substituição", technician: "C. Silva", status: "Concluída" },
  ];
  
  // Mock data for inventory
  const inventoryItems = [
    { id: "INV-1021", name: "Lâmpadas LED para Taxiway", quantity: 48, location: "Depósito Principal", status: "Em estoque" },
    { id: "INV-1022", name: "Fonte de Alimentação PAPI", quantity: 3, location: "Depósito Principal", status: "Em estoque" },
    { id: "INV-1023", name: "Cabos de Sinal (metros)", quantity: 250, location: "Depósito Principal", status: "Em estoque" },
    { id: "INV-1024", name: "Módulos Radar Substitutos", quantity: 2, location: "Depósito Técnico", status: "Em estoque" },
    { id: "INV-1025", name: "Sensores de Atrito", quantity: 1, location: "Depósito Técnico", status: "Baixo estoque" },
  ];
  
  // Equipment Types for filter
  const equipmentTypes = [
    { id: "all", label: "Todos" },
    { id: "lighting", label: "Iluminação" },
    { id: "radar", label: "Radar e Sensores" },
    { id: "power", label: "Energia" },
    { id: "communication", label: "Comunicação" }
  ];
  
  // Filter equipment by type
  const filteredEquipment = selectedEquipmentType === "all" 
    ? equipmentStatus 
    : equipmentStatus.filter(item => item.name.toLowerCase().includes(selectedEquipmentType));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operador"
        currentRoute="/equipamentos"
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Monitoramento de Equipamentos</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Gerenciamento e monitoramento de equipamentos críticos do aeroporto</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <select 
              value={selectedEquipmentType}
              onChange={(e) => setSelectedEquipmentType(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-800 rounded-md border-none p-2 text-sm"
            >
              {equipmentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
            
            <Button variant="outline" size="sm" className="bg-neutral-100 dark:bg-neutral-800">
              <span className="material-icons text-sm mr-1">refresh</span>
              Atualizar
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Visão Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equipmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {equipmentStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => {
                      const percentage = ((Number(value) / totalEquipment) * 100).toFixed(0);
                      return [`${value} (${percentage}%)`, name];
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Operacional</div>
                  <div className="font-medium text-success">{statusCounts.operational}</div>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Atenção</div>
                  <div className="font-medium text-warning">{statusCounts.warning}</div>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Falha</div>
                  <div className="font-medium text-critical">{statusCounts.critical}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Equipamentos em Falha ou Atenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipmentStatus
                  .filter(item => item.status !== "operational")
                  .map((item, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "p-3 rounded-lg border-l-4",
                        item.status === "critical" 
                          ? "border-critical bg-critical bg-opacity-5" 
                          : "border-warning bg-warning bg-opacity-5"
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="text-sm text-neutral-600 dark:text-neutral-300">{item.location}</div>
                        </div>
                        <Badge
                          className={cn(
                            item.status === "critical" 
                              ? "bg-critical" 
                              : "bg-warning text-black"
                          )}
                        >
                          {item.status === "critical" ? "Falha" : "Atenção"}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm">{item.lastUpdate}</div>
                    </div>
                  ))}
                
                {equipmentStatus.filter(item => item.status !== "operational").length === 0 && (
                  <div className="text-center p-8">
                    <span className="material-icons text-4xl text-success mb-2">check_circle</span>
                    <h3 className="text-lg font-medium mb-1">Nenhum equipamento em falha</h3>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      Todos os equipamentos estão operando normalmente.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="overview">Lista de Equipamentos</TabsTrigger>
            <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
            <TabsTrigger value="inventory">Inventário</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Lista de Equipamentos</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <span className="material-icons text-neutral-400 text-sm">search</span>
                      </span>
                      <input
                        className="bg-neutral-100 dark:bg-neutral-800 py-1 pl-8 pr-4 rounded-md w-64 text-sm placeholder:text-neutral-400"
                        placeholder="Buscar equipamento..."
                        type="text"
                      />
                    </div>
                    <Button size="sm" variant="outline" className="bg-neutral-100 dark:bg-neutral-800">
                      <span className="material-icons text-sm">filter_list</span>
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
                        <th className="text-left font-medium py-2 px-2">Equipamento</th>
                        <th className="text-left font-medium py-2 px-2">Localização</th>
                        <th className="text-left font-medium py-2 px-2">Status</th>
                        <th className="text-left font-medium py-2 px-2">Última Atualização</th>
                        <th className="text-left font-medium py-2 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEquipment.map((item, index) => (
                        <tr 
                          key={index} 
                          className={cn(
                            "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                            index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                          )}
                        >
                          <td className="py-2 px-2">EQ-{index + 1}</td>
                          <td className="py-2 px-2 font-medium">{item.name}</td>
                          <td className="py-2 px-2">{item.location}</td>
                          <td className="py-2 px-2">
                            <Badge
                              className={cn(
                                item.status === "operational" 
                                  ? "bg-success" 
                                  : item.status === "warning" 
                                    ? "bg-warning text-black" 
                                    : "bg-critical"
                              )}
                            >
                              {item.status === "operational" ? "Operacional" : item.status === "warning" ? "Atenção" : "Falha"}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 text-xs">{item.lastUpdate}</td>
                          <td className="py-2 px-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs">Detalhes</Button>
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
                <CardTitle className="text-lg">Mapa de Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 rounded-lg overflow-hidden bg-neutral-100 dark:bg-darkbg-card">
                  <img 
                    src="https://images.unsplash.com/photo-1543968332-f99478b1ebdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
                    alt="Mapa do aeroporto" 
                    className="w-full h-full object-cover opacity-70 dark:opacity-50"
                  />
                  
                  {/* Overlay elements - mapped equipment locations */}
                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    {/* Simulated equipment locations */}
                    <div className="absolute top-[20%] left-[30%]">
                      <div className="relative">
                        <span className="material-icons text-critical animate-pulse">location_on</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          Sistema de Iluminação
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-[40%] left-[60%]">
                      <div className="relative">
                        <span className="material-icons text-success">location_on</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          Radar de Superfície
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-[60%] left-[40%]">
                      <div className="relative">
                        <span className="material-icons text-warning">location_on</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-70 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          Gerador de Emergência
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
          
          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Manutenção Preventiva</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisData.maintenancePredictions.map((item, index) => (
                      <div 
                        key={index} 
                        className={`bg-white dark:bg-neutral-800 p-3 rounded border-l-4 border-${item.status}`}
                      >
                        <div className="font-medium">{item.equipment}</div>
                        <div className="text-sm">{item.prediction}</div>
                        <div className="text-xs text-neutral-500">{item.reason}</div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full text-sm text-primary">
                      Ver todos os itens
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Histórico de Manutenção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <th className="text-left font-medium py-2 px-2">ID</th>
                          <th className="text-left font-medium py-2 px-2">Equipamento</th>
                          <th className="text-left font-medium py-2 px-2">Data</th>
                          <th className="text-left font-medium py-2 px-2">Tipo</th>
                          <th className="text-left font-medium py-2 px-2">Técnico</th>
                          <th className="text-left font-medium py-2 px-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenanceHistory.map((item, index) => (
                          <tr 
                            key={index} 
                            className={cn(
                              "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                              index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                            )}
                          >
                            <td className="py-2 px-2">{item.id}</td>
                            <td className="py-2 px-2">{item.equipment}</td>
                            <td className="py-2 px-2">{item.date}</td>
                            <td className="py-2 px-2">{item.type}</td>
                            <td className="py-2 px-2">{item.technician}</td>
                            <td className="py-2 px-2">
                              <Badge className="bg-success">{item.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" size="sm">
                      <span className="material-icons text-sm mr-1">file_download</span>
                      Exportar
                    </Button>
                    <Button variant="outline" size="sm">
                      Ver histórico completo
                      <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Programação de Manutenção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-3">Hoje - 18/05/2023</h3>
                    <div className="space-y-2">
                      <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg border-l-4 border-primary">
                        <div className="flex justify-between">
                          <div className="font-medium">Calibração do Sistema PAPI - Pista 09L</div>
                          <div className="text-xs text-neutral-500">08:00 - 10:00</div>
                        </div>
                        <div className="text-sm mt-1">Técnico: M. Oliveira</div>
                      </div>
                      
                      <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg border-l-4 border-primary">
                        <div className="flex justify-between">
                          <div className="font-medium">Inspeção das Luzes de Aproximação - Pista 27L</div>
                          <div className="text-xs text-neutral-500">14:00 - 16:00</div>
                        </div>
                        <div className="text-sm mt-1">Técnico: C. Silva</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Amanhã - 19/05/2023</h3>
                    <div className="space-y-2">
                      <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg border-l-4 border-primary">
                        <div className="flex justify-between">
                          <div className="font-medium">Manutenção do Gerador de Emergência #1</div>
                          <div className="text-xs text-neutral-500">09:00 - 12:00</div>
                        </div>
                        <div className="text-sm mt-1">Técnico: R. Almeida</div>
                      </div>
                      
                      <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg border-l-4 border-primary">
                        <div className="flex justify-between">
                          <div className="font-medium">Reparo do Sistema de Iluminação - Taxiway C</div>
                          <div className="text-xs text-neutral-500">10:00 - 16:00</div>
                        </div>
                        <div className="text-sm mt-1">Técnico: J. Santos</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg text-center">
                  <Button>
                    <span className="material-icons text-sm mr-1">add</span>
                    Agendar Nova Manutenção
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Controle de Inventário</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-neutral-100 dark:bg-neutral-800">
                      <span className="material-icons text-sm mr-1">add</span>
                      Novo Item
                    </Button>
                    <Button variant="outline" size="sm" className="bg-neutral-100 dark:bg-neutral-800">
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
                        <th className="text-left font-medium py-2 px-2">Item</th>
                        <th className="text-left font-medium py-2 px-2">Quantidade</th>
                        <th className="text-left font-medium py-2 px-2">Localização</th>
                        <th className="text-left font-medium py-2 px-2">Status</th>
                        <th className="text-left font-medium py-2 px-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems.map((item, index) => (
                        <tr 
                          key={index} 
                          className={cn(
                            "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                            index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                          )}
                        >
                          <td className="py-2 px-2">{item.id}</td>
                          <td className="py-2 px-2 font-medium">{item.name}</td>
                          <td className="py-2 px-2">{item.quantity}</td>
                          <td className="py-2 px-2">{item.location}</td>
                          <td className="py-2 px-2">
                            <Badge
                              className={cn(
                                item.status === "Em estoque" 
                                  ? "bg-success" 
                                  : "bg-warning text-black"
                              )}
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <span className="material-icons text-sm">edit</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <span className="material-icons text-sm">history</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <div className="text-sm text-neutral-500">
                    Mostrando 5 de 38 itens
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
                      <span className="material-icons text-sm">chevron_right</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alertas de Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-warning bg-opacity-5 border-l-4 border-warning rounded-lg">
                      <h3 className="font-medium">Sensores de Atrito</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Quantidade atual: 1</span>
                        <span className="text-sm">Mínimo recomendado: 3</span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Solicitar compra
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-warning bg-opacity-5 border-l-4 border-warning rounded-lg">
                      <h3 className="font-medium">Cabos de Sinal</h3>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Quantidade atual: 250m</span>
                        <span className="text-sm">Mínimo recomendado: 300m</span>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Solicitar compra
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consumo Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Jan", value: 12 },
                          { name: "Fev", value: 8 },
                          { name: "Mar", value: 15 },
                          { name: "Abr", value: 10 },
                          { name: "Mai", value: 5 }
                        ]}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1A73E8" name="Itens Consumidos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Itens Mais Solicitados (2023)</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lâmpadas LED para Taxiway</span>
                        <span>42 unidades</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cabos de Sinal</span>
                        <span>750 metros</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fusíveis Especiais</span>
                        <span>36 unidades</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Uptime dos Equipamentos Críticos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={uptimeHistory}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis domain={[96, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="uptime" 
                        stroke="#4CAF50" 
                        name="Uptime (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">Uptime Mensal</div>
                    <div className="text-2xl font-medium text-success">99.2%</div>
                    <div className="text-xs text-neutral-500">Meta: 99.0%</div>
                  </div>
                  
                  <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">Tempo Médio de Reparo</div>
                    <div className="text-2xl font-medium">4.3h</div>
                    <div className="text-xs text-success">▼ 12% em relação ao mês anterior</div>
                  </div>
                  
                  <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">Incidentes Resolvidos</div>
                    <div className="text-2xl font-medium">24</div>
                    <div className="text-xs text-warning">▲ 8% em relação ao mês anterior</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Sistemas de Iluminação</span>
                        <span className="text-sm">98.7%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '98.7%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Radar e Sensores</span>
                        <span className="text-sm">99.5%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '99.5%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Sistemas de Comunicação</span>
                        <span className="text-sm">99.9%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '99.9%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Sistemas de Energia</span>
                        <span className="text-sm">98.2%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '98.2%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Meteorologia</span>
                        <span className="text-sm">100%</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                        <div className="bg-success h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Análise de Falhas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Falha de Hardware", value: 12, color: "#D32F2F" },
                            { name: "Falha de Software", value: 4, color: "#7B1FA2" },
                            { name: "Falha Humana", value: 3, color: "#FFA000" },
                            { name: "Falha de Energia", value: 5, color: "#388E3C" }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {[
                            { name: "Falha de Hardware", value: 12, color: "#D32F2F" },
                            { name: "Falha de Software", value: 4, color: "#7B1FA2" },
                            { name: "Falha Humana", value: 3, color: "#FFA000" },
                            { name: "Falha de Energia", value: 5, color: "#388E3C" }
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
                  
                  <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Principais Causas</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Desgaste natural</span>
                        <span>42%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Falha de componente</span>
                        <span>28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Instabilidade elétrica</span>
                        <span>15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Configuração incorreta</span>
                        <span>10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outros</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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