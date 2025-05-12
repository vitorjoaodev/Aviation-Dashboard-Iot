import React, { useEffect, useState } from "react";
import { format, subDays } from "date-fns";
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
  Bar,
  AreaChart, 
  Area
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Analysis() {
  const { 
    analysisData, 
    currentTime,
    notificationCount,
    analysisPeriod, 
    setAnalysisPeriod
  } = useDashboard();
  
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("trends");
  
  useEffect(() => {
    document.title = "GRU IOT - Data Analysis";
  }, []);

  const formattedTime = format(currentTime, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });
  
  // Generate some additional data for analytics
  
  // Operational statistics
  const operationalStats = {
    runwayUtilization: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      "09R/27L": Math.min(95, 50 + Math.random() * 45),
      "09L/27R": Math.min(90, 40 + Math.random() * 40)
    })),
    weatherImpact: Array.from({ length: 12 }, (_, i) => {
      const month = format(new Date(2023, i, 1), "MMM", { locale: ptBR });
      return {
        month,
        delay: Math.round(Math.random() * 120), // minutes of delay
        cancellations: Math.round(Math.random() * 5)
      };
    }),
    performanceMetrics: [
      { name: "Uptime Pistas", target: 99.5, actual: 99.7, unit: "%" },
      { name: "Uptime Sistemas", target: 99.9, actual: 99.8, unit: "%" },
      { name: "Tempo Médio Resposta", target: 5, actual: 4.3, unit: "min" },
      { name: "Incidentes Reportados", target: 50, actual: 44, unit: "" },
      { name: "Custo Manutenção", target: 100, actual: 92, unit: "%" }
    ]
  };
  
  // Safety statistics
  const safetyStats = {
    incidentsByRunway: [
      { name: "09R/27L", value: 18 },
      { name: "09L/27R", value: 12 },
      { name: "Taxiways", value: 8 },
      { name: "Outros", value: 6 }
    ],
    fod: Array.from({ length: 12 }, (_, i) => {
      const month = format(new Date(2023, i, 1), "MMM", { locale: ptBR });
      return {
        month,
        detections: Math.round(2 + Math.random() * 8)
      };
    }),
    incidentResolutions: [
      { name: "< 5 min", value: 52 },
      { name: "5-15 min", value: 32 },
      { name: "15-30 min", value: 10 },
      { name: "> 30 min", value: 6 }
    ]
  };
  
  // Weather statistics
  const weatherStats = {
    weatherConditions: Array.from({ length: 12 }, (_, i) => {
      const month = format(new Date(2023, i, 1), "MMM", { locale: ptBR });
      return {
        month,
        rain: Math.round(Math.random() * 15), // days
        fog: Math.round(Math.random() * 8), // days
        lightning: Math.round(Math.random() * 5) // days
      };
    }),
    visibilityAverage: Array.from({ length: 12 }, (_, i) => {
      const month = format(new Date(2023, i, 1), "MMM", { locale: ptBR });
      return {
        month,
        value: Math.round((5 + Math.random() * 5) * 10) / 10
      };
    }),
    rainfallTotal: Array.from({ length: 12 }, (_, i) => {
      const month = format(new Date(2023, i, 1), "MMM", { locale: ptBR });
      return {
        month,
        value: Math.round(50 + Math.random() * 150)
      };
    })
  };
  
  // Get date range for the selected analysis period
  const getDateRangeText = () => {
    const today = new Date();
    let start;
    
    switch(analysisPeriod) {
      case "24h":
        start = subDays(today, 1);
        return `${format(start, "dd/MM", { locale: ptBR })} - ${format(today, "dd/MM", { locale: ptBR })}`;
      case "7d":
        start = subDays(today, 7);
        return `${format(start, "dd/MM", { locale: ptBR })} - ${format(today, "dd/MM", { locale: ptBR })}`;
      case "30d":
        start = subDays(today, 30);
        return `${format(start, "dd/MM", { locale: ptBR })} - ${format(today, "dd/MM", { locale: ptBR })}`;
      default:
        return "Período personalizado";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operador"
        currentRoute="/analises"
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Análise de Dados</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Análises avançadas e previsões baseadas em dados operacionais</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="flex items-center">
              <span className="text-sm mr-2">Período:</span>
              <select 
                value={analysisPeriod}
                onChange={(e) => setAnalysisPeriod(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-md border-none p-2 text-sm"
              >
                <option value="24h">Últimas 24h</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="custom">Personalizado</option>
              </select>
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
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <CardTitle className="text-xl">Visão Geral do Período</CardTitle>
                <CardDescription>{getDateRangeText()}</CardDescription>
              </div>
              <div className="mt-2 md:mt-0">
                <Button variant="outline" size="sm" className="bg-neutral-100 dark:bg-neutral-800">
                  <span className="material-icons text-sm mr-1">calendar_today</span>
                  Escolher Datas
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg text-center">
                <div className="text-xs text-neutral-500 mb-1">Total Incidentes</div>
                <div className="text-2xl font-medium">{analysisData.totalIncidents}</div>
                <div className="text-xs text-success">▼ 8% vs. período anterior</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg text-center">
                <div className="text-xs text-neutral-500 mb-1">Tempo Resposta</div>
                <div className="text-2xl font-medium">{analysisData.responseTimeStats.average} min</div>
                <div className="text-xs text-success">▼ 12% vs. período anterior</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg text-center">
                <div className="text-xs text-neutral-500 mb-1">Uptime Equipamentos</div>
                <div className="text-2xl font-medium">99.7%</div>
                <div className="text-xs text-success">▲ 0.2% vs. período anterior</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg text-center">
                <div className="text-xs text-neutral-500 mb-1">Detecções FOD</div>
                <div className="text-2xl font-medium">14</div>
                <div className="text-xs text-warning">▲ 5% vs. período anterior</div>
              </div>
              
              <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-lg text-center">
                <div className="text-xs text-neutral-500 mb-1">Impacto Meteorológico</div>
                <div className="text-2xl font-medium">Baixo</div>
                <div className="text-xs text-success">▼ 15% em atrasos</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData.incidentTrend}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="critical" stroke="#D50000" name="Críticos" />
                    <Line type="monotone" dataKey="warning" stroke="#F9A825" name="Atenção" />
                    <Line type="monotone" dataKey="info" stroke="#616E7C" name="Informativos" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="operational">Operacional</TabsTrigger>
            <TabsTrigger value="safety">Segurança</TabsTrigger>
            <TabsTrigger value="weather">Meteorologia</TabsTrigger>
            <TabsTrigger value="predictive">Previsões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Incidentes por Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analysisData.incidentsByCategory}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {analysisData.incidentsByCategory.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} (${((value as number / analysisData.totalIncidents) * 100).toFixed(0)}%)`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="w-full md:w-1/2 mt-4 md:mt-0">
                      <div className="space-y-3">
                        {analysisData.incidentsByCategory.map((category, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1 text-sm">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                                <span>{category.name}</span>
                              </div>
                              <span>{category.value} ({((category.value / analysisData.totalIncidents) * 100).toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${(category.value / analysisData.totalIncidents) * 100}%`,
                                  backgroundColor: category.color 
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tempo de Resposta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analysisData.responseTime}
                        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="value" 
                          fill="#1A73E8" 
                          name="Minutos" 
                          radius={[4, 4, 0, 0]}
                        />
                        <ReferenceLine 
                          y={analysisData.responseTimeStats.average} 
                          stroke="#F44336" 
                          strokeDasharray="3 3" 
                          label={{ 
                            value: `Média: ${analysisData.responseTimeStats.average} min`, 
                            position: 'top',
                            fill: '#F44336',
                            fontSize: 12
                          }} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">Tempo Médio</div>
                      <div className="text-lg font-medium">{analysisData.responseTimeStats.average} min</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">Melhor Tempo</div>
                      <div className="text-lg font-medium">{analysisData.responseTimeStats.best} min</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">Meta</div>
                      <div className="text-lg font-medium">{analysisData.responseTimeStats.target} min</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tendência Anual de Incidentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { mes: "Jan", "2022": 35, "2023": 28 },
                        { mes: "Fev", "2022": 42, "2023": 31 },
                        { mes: "Mar", "2022": 28, "2023": 24 },
                        { mes: "Abr", "2022": 37, "2023": 30 },
                        { mes: "Mai", "2022": 40, "2023": 33 },
                        { mes: "Jun", "2022": 45, "2023": 38 },
                        { mes: "Jul", "2022": 32, "2023": 26 },
                        { mes: "Ago", "2022": 30, "2023": 25 },
                        { mes: "Set", "2022": 38, "2023": 35 },
                        { mes: "Out", "2022": 42, "2023": 37 },
                        { mes: "Nov", "2022": 48, "2023": null },
                        { mes: "Dez", "2022": 52, "2023": null }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="2022" 
                        stroke="#FF9800" 
                        fill="#FF9800" 
                        fillOpacity={0.2} 
                        name="2022" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="2023" 
                        stroke="#4CAF50" 
                        fill="#4CAF50" 
                        fillOpacity={0.2} 
                        name="2023" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <h3 className="font-medium mb-3">Análise de Tendência</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Redução Ano-a-Ano</h4>
                      <div className="text-sm">
                        <p>A análise revela uma redução consistente no número de incidentes de 2022 para 2023, com média de 16% de redução.</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Padrões Sazonais</h4>
                      <div className="text-sm">
                        <p>Picos em períodos de alta temporada (dezembro-janeiro e julho) e maior incidência durante períodos de chuva intensa.</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Previsão</h4>
                      <div className="text-sm">
                        <p>A continuar a tendência atual, expectativa de encerrar 2023 com redução de ~15% no total de incidentes em relação a 2022.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="operational" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Utilização das Pistas (Últimas 24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={operationalStats.runwayUtilization}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}:00`}
                          domain={[0, 23]}
                        />
                        <YAxis domain={[0, 100]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, "Utilização"]}
                          labelFormatter={(hour) => `${hour}:00`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="09R/27L" 
                          stroke="#1A73E8" 
                          name="09R/27L" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="09L/27R" 
                          stroke="#F9A825" 
                          name="09L/27R" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">09R/27L Média</div>
                      <div className="text-lg font-medium">82%</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">09L/27R Média</div>
                      <div className="text-lg font-medium">65%</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-xs text-neutral-500 mb-1">Hora de Pico</div>
                      <div className="text-lg font-medium">08:00 - 10:00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Indicadores de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalStats.performanceMetrics.map((metric, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{metric.name}</span>
                          <span>
                            {metric.actual}{metric.unit} / Meta: {metric.target}{metric.unit}
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div 
                            className={cn(
                              "h-2.5 rounded-full",
                              metric.actual >= metric.target 
                                ? "bg-success" 
                                : metric.actual >= metric.target * 0.9 
                                  ? "bg-warning" 
                                  : "bg-critical"
                            )}
                            style={{ 
                              width: `${Math.min(100, (metric.actual / metric.target) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Status Geral</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-success"></div>
                      <span>Sistemas operando dentro dos parâmetros esperados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Impacto das Condições Meteorológicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={operationalStats.weatherImpact}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        yAxisId="left" 
                        dataKey="delay" 
                        fill="#1E88E5" 
                        name="Atrasos (min)" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        yAxisId="right" 
                        dataKey="cancellations" 
                        fill="#D32F2F" 
                        name="Cancelamentos" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <h3 className="font-medium mb-3">Análise de Impacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Períodos Críticos</h4>
                      <div className="text-sm">
                        <p>Os meses de verão (dezembro a março) apresentam maior impacto devido a tempestades, enquanto junho/julho são afetados por períodos de neblina.</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Medidas de Mitigação</h4>
                      <div className="text-sm">
                        <p>Implementação de novos sistemas de previsão reduziu o impacto em 22% em comparação com anos anteriores.</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Eficiência</h4>
                      <div className="text-sm">
                        <p>Tempo médio de recuperação após eventos meteorológicos reduzido em 18% graças à melhoria nos procedimentos de contingência.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Eficiência de Manutenção</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Preventiva", value: 68, color: "#4CAF50" },
                              { name: "Corretiva", value: 24, color: "#F9A825" },
                              { name: "Emergencial", value: 8, color: "#F44336" }
                            ]}
                            cx={isMobile ? "50%" : "40%"}
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={1}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[
                              { name: "Preventiva", value: 68, color: "#4CAF50" },
                              { name: "Corretiva", value: 24, color: "#F9A825" },
                              { name: "Emergencial", value: 8, color: "#F44336" }
                            ].map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} (${((value as number / 100) * 100).toFixed(0)}%)`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-md font-medium mb-2">Distribuição de Manutenções</h3>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
                                <span>Preventiva</span>
                              </div>
                              <span>68%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-success h-2 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
                                <span>Corretiva</span>
                              </div>
                              <span>24%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-warning h-2 rounded-full" style={{ width: '24%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-critical mr-2"></div>
                                <span>Emergencial</span>
                              </div>
                              <span>8%</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                              <div className="bg-critical h-2 rounded-full" style={{ width: '8%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Análise de Eficiência</h4>
                        <div className="text-sm">
                          <p>Aumento de 15% em manutenções preventivas resultou em redução de 28% em custos de manutenção emergencial e 42% em tempo de inatividade.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="safety" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Incidentes por Localização</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={safetyStats.incidentsByRunway}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={1}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#1A73E8" />
                          <Cell fill="#F9A825" />
                          <Cell fill="#4CAF50" />
                          <Cell fill="#9E9E9E" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Distribuição por Localização</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>09R/27L: {safetyStats.incidentsByRunway[0].value} incidentes</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                        <span>09L/27R: {safetyStats.incidentsByRunway[1].value} incidentes</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Taxiways: {safetyStats.incidentsByRunway[2].value} incidentes</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                        <span>Outros: {safetyStats.incidentsByRunway[3].value} incidentes</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Tempo de Resolução de Incidentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={safetyStats.incidentResolutions}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={1}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#FFC107" />
                          <Cell fill="#FF9800" />
                          <Cell fill="#F44336" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Performance de Resolução</h3>
                    <div className="space-y-2 text-sm">
                      <div>84% dos incidentes são resolvidos em menos de 15 minutos</div>
                      <div>Tempo médio de resolução: {analysisData.responseTimeStats.average} minutos</div>
                      <div>Redução de 12% no tempo médio de resolução em relação ao período anterior</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detecções de FOD (Últimos 12 Meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={safetyStats.fod}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar 
                        dataKey="detections" 
                        fill="#1A73E8" 
                        name="Detecções de FOD" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Estatísticas de FOD</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total de detecções:</span>
                        <span>62</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Média mensal:</span>
                        <span>5.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tempo médio de remoção:</span>
                        <span>3.5 min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Tipos Mais Comuns</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fragmentos de pneu:</span>
                        <span>38%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Peças metálicas:</span>
                        <span>24%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Outros detritos:</span>
                        <span>38%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Sistema de Detecção</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Detecção automática:</span>
                        <span>78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inspeção visual:</span>
                        <span>15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reportes externos:</span>
                        <span>7%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Indicadores de Segurança Operacional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Detecção e remoção de FOD</span>
                          <span>98.5% / Meta: 99%</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-success h-2.5 rounded-full" style={{ width: '98.5%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Tempo médio de resposta a incidentes</span>
                          <span>4.3 min / Meta: 5 min</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-success h-2.5 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Conformidade com procedimentos de segurança</span>
                          <span>99.7% / Meta: 99.5%</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-success h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Precisão dos sistemas de monitoramento</span>
                          <span>98.9% / Meta: 99%</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-success h-2.5 rounded-full" style={{ width: '99.8%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Disponibilidade dos sistemas de segurança</span>
                          <span>99.94% / Meta: 99.9%</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-success h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg h-full flex flex-col justify-center">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success text-white">
                          <span className="material-icons text-3xl">check_circle</span>
                        </div>
                      </div>
                      <h3 className="text-center text-lg font-medium mb-2">Status de Segurança</h3>
                      <div className="text-center text-sm">
                        <p>Todos os sistemas de segurança estão operando conforme esperado, com performance acima das metas estabelecidas.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="weather" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Condições Meteorológicas (Dias por Mês)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weatherStats.weatherConditions}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="rain" 
                          fill="#42A5F5" 
                          name="Chuva" 
                          radius={[4, 4, 0, 0]}
                          stackId="a"
                        />
                        <Bar 
                          dataKey="fog" 
                          fill="#9E9E9E" 
                          name="Névoa/Neblina" 
                          radius={[4, 4, 0, 0]}
                          stackId="a"
                        />
                        <Bar 
                          dataKey="lightning" 
                          fill="#FFA726" 
                          name="Trovoadas" 
                          radius={[4, 4, 0, 0]}
                          stackId="a"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Visibilidade Média (km)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weatherStats.visibilityAverage}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4CAF50" 
                          dot={{ fill: "#4CAF50" }}
                          name="Visibilidade (km)"
                        />
                        <ReferenceLine 
                          y={5} 
                          stroke="#F44336" 
                          strokeDasharray="3 3" 
                          label={{ 
                            value: 'Limite Operacional', 
                            position: 'insideBottomRight',
                            fill: '#F44336',
                            fontSize: 12
                          }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Precipitação Total (mm)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={weatherStats.rainfallTotal}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#1976D2" 
                        fill="#1976D2" 
                        fillOpacity={0.3}
                        name="Precipitação (mm)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Precipitação Anual</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total anual:</span>
                        <span>1325 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Média mensal:</span>
                        <span>110.4 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mês mais chuvoso:</span>
                        <span>Janeiro (194 mm)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Impacto Operacional</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Dias com chuva intensa:</span>
                        <span>24</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operações afetadas:</span>
                        <span>18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Atrasos relacionados:</span>
                        <span>5.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Sistema de Drenagem</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Capacidade utilizada (max):</span>
                        <span>78%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eficiência de escoamento:</span>
                        <span>95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manutenções preventivas:</span>
                        <span>12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Atividade de Raios (Últimos 12 Meses)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={weatherStats.weatherConditions}
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar 
                            dataKey="lightning" 
                            fill="#FF9800" 
                            name="Dias com trovoada" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <h3 className="font-medium mb-2">Estatísticas de Raios</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total de dias com atividade:</span>
                            <span>42</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duração média:</span>
                            <span>87 min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Detecções dentro de 5km:</span>
                            <span>28 eventos</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <h3 className="font-medium mb-2">Protocolos de Segurança</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Alertas emitidos:</span>
                            <span>124</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Suspensões de atividade:</span>
                            <span>64</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tempo médio de suspensão:</span>
                            <span>42 min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictive" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Previsão de Manutenção</CardTitle>
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
                    
                    <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <h3 className="font-medium mb-2">Análise Preditiva</h3>
                      <div className="text-sm">
                        <p>O sistema de manutenção preditiva identificou padrões de desgaste com base em dados históricos e sensores em tempo real. As previsões têm precisão média de 92%.</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        Ver todas as previsões
                        <span className="material-icons text-sm ml-1">arrow_forward</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Previsão de Incidentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: "Jun", atual: 8, previsão: 8 },
                          { month: "Jul", atual: 6, previsão: 7 },
                          { month: "Ago", atual: 7, previsão: 6 },
                          { month: "Set", atual: 9, previsão: 8 },
                          { month: "Out", atual: 11, previsão: 10 },
                          { month: "Nov", atual: null, previsão: 12 },
                          { month: "Dez", atual: null, previsão: 14 },
                          { month: "Jan", atual: null, previsão: 12 }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="atual" 
                          stroke="#1A73E8"
                          name="Incidentes Reais" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="previsão" 
                          stroke="#F9A825" 
                          strokeDasharray="5 5"
                          name="Previsão" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <h3 className="font-medium mb-2">Análise de Tendência</h3>
                    <div className="text-sm">
                      <p>Com base em análises de padrões sazonais e condições meteorológicas previstas, espera-se um aumento nos incidentes durante o período de verão (dezembro-janeiro) devido ao aumento de tempestades e maior fluxo de operações.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Previsão de Condições Meteorológicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { month: "Jun", precip: 45, visibility: 8.2 },
                            { month: "Jul", precip: 40, visibility: 7.8 },
                            { month: "Ago", precip: 38, visibility: 8.1 },
                            { month: "Set", precip: 65, visibility: 7.5 },
                            { month: "Out", precip: 85, visibility: 7.2 },
                            { month: "Nov", precip: 120, visibility: 6.8 },
                            { month: "Dez", precip: 165, visibility: 6.5 },
                            { month: "Jan", precip: 190, visibility: 6.2 },
                            { month: "Fev", precip: 170, visibility: 6.4 },
                            { month: "Mar", precip: 145, visibility: 6.7 },
                            { month: "Abr", precip: 90, visibility: 7.0 },
                            { month: "Mai", precip: 60, visibility: 7.4 }
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" orientation="left" />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="precip" 
                            stroke="#1976D2" 
                            name="Precipitação Prevista (mm)" 
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="visibility" 
                            stroke="#4CAF50" 
                            name="Visibilidade Média Prevista (km)" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-4">
                      <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <h3 className="font-medium mb-2">Previsão para Próximos Meses</h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Verão (Dez-Fev):</span>
                            <p>Alta precipitação com tempestades frequentes. Recomenda-se revisão de sistemas de drenagem e preparação para operações em condições adversas.</p>
                          </div>
                          <div>
                            <span className="font-medium">Outono (Mar-Mai):</span>
                            <p>Redução gradual de precipitação com possibilidade de névoa matinal. Visibilidade melhorando progressivamente.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <h3 className="font-medium mb-2">Medidas Recomendadas</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start">
                            <span className="material-icons text-primary text-sm mr-2 mt-0.5">check_circle</span>
                            <span>Revisão de sistemas de drenagem em novembro</span>
                          </div>
                          <div className="flex items-start">
                            <span className="material-icons text-primary text-sm mr-2 mt-0.5">check_circle</span>
                            <span>Preparação de equipes adicionais para dezembro-fevereiro</span>
                          </div>
                          <div className="flex items-start">
                            <span className="material-icons text-primary text-sm mr-2 mt-0.5">check_circle</span>
                            <span>Revisão de protocolos para operação com visibilidade reduzida</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Previsão de Performance Operacional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Resumo de Previsões</h3>
                    <div className="space-y-4">
                      <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Eficiência Operacional</h4>
                          <span className="text-success">▲ 4.2%</span>
                        </div>
                        <p className="text-sm">Previsão de aumento na eficiência operacional para o próximo trimestre baseada em melhorias em sistemas críticos e redução no tempo de resposta a incidentes.</p>
                      </div>
                      
                      <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Impacto de Manutenção</h4>
                          <span className="text-success">▼ 8.7%</span>
                        </div>
                        <p className="text-sm">Redução prevista em tempo de inatividade devido a manutenção, resultado da implementação de manutenção preditiva e melhorias nos processos preventivos.</p>
                      </div>
                      
                      <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Incidentes de Segurança</h4>
                          <span className="text-success">▼ 12.5%</span>
                        </div>
                        <p className="text-sm">Previsão de redução em incidentes de segurança operacional baseada em melhorias implementadas e melhor detecção preventiva de riscos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Comparativo de Performance (Projeção vs. Realizado)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart 
                          cx="50%" 
                          cy="50%" 
                          outerRadius="80%" 
                          data={[
                            { subject: 'Eficiência', projeção: 85, atual: 78 },
                            { subject: 'Segurança', projeção: 90, atual: 88 },
                            { subject: 'Rapidez', projeção: 88, atual: 82 },
                            { subject: 'Precisão', projeção: 92, atual: 90 },
                            { subject: 'Custo', projeção: 82, atual: 80 }
                          ]}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar 
                            name="Projeção" 
                            dataKey="projeção" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.2} 
                          />
                          <Radar 
                            name="Atual" 
                            dataKey="atual" 
                            stroke="#82ca9d" 
                            fill="#82ca9d" 
                            fillOpacity={0.2} 
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <h4 className="font-medium mb-2">Recomendações</h4>
                      <div className="text-sm">
                        <p>Baseado na análise comparativa, recomenda-se foco em melhorias de rapidez e eficiência para atingir as projeções estabelecidas. Áreas de precisão e segurança estão próximas às metas projetadas.</p>
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