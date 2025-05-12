import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/dashboard-context";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from "recharts";

export function DataAnalysis() {
  const { 
    analysisData,
    setAnalysisPeriod,
    analysisPeriod
  } = useDashboard();

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap">
          <CardTitle className="text-xl">Análise de Dados</CardTitle>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <div className="text-sm">Período:</div>
            <Select value={analysisPeriod} onValueChange={setAnalysisPeriod}>
              <SelectTrigger className="bg-neutral-100 dark:bg-neutral-800 border-none w-36 text-sm">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="outline" className="p-1 bg-neutral-100 dark:bg-neutral-800">
              <span className="material-icons text-sm">date_range</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Incidentes por Categoria</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysisData.incidentsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={65}
                    fill="#8884d8"
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
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              {analysisData.incidentsByCategory.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name}: {entry.value} ({((entry.value / analysisData.totalIncidents) * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Tempo de Resposta (min)</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analysisData.responseTime}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1A73E8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center justify-between mb-1">
                <span>Tempo médio de resposta:</span>
                <span className="font-medium">{analysisData.responseTimeStats.average} min</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span>Melhor tempo:</span>
                <span className="font-medium">{analysisData.responseTimeStats.best} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Meta atual:</span>
                <span className="font-medium">{analysisData.responseTimeStats.target} min</span>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Previsão de Manutenção</h3>
            <div className="space-y-2 mb-2">
              {analysisData.maintenancePredictions.map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-neutral-800 p-2 rounded border-l-4 border-${item.status}`}
                >
                  <div className="font-medium">{item.equipment}</div>
                  <div className="text-xs">{item.prediction}</div>
                  <div className="text-xs text-neutral-500">{item.reason}</div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full text-sm text-primary border border-primary rounded-md py-1 hover:bg-primary hover:bg-opacity-5 mt-2">
              Ver todos os itens
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-3">Tendência de Incidentes ({analysisPeriod === "24h" ? "Últimas 24h" : analysisPeriod === "7d" ? "Últimos 7 dias" : "Últimos 30 dias"})</h3>
          <div className="h-64 rounded-lg bg-neutral-50 dark:bg-darkbg-card p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analysisData.incidentTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
  );
}
