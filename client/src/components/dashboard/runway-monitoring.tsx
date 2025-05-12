import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/dashboard-context";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export function RunwayMonitoring() {
  const { runwayData, temperatureData, frictionData } = useDashboard();

  return (
    <Card className="lg:col-span-2 xl:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Monitoramento de Pistas</CardTitle>
          <Button variant="link" className="text-primary text-sm">
            Ver detalhes
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Runway Map */}
        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-neutral-100 dark:bg-darkbg-card">
          <img 
            src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
            alt="Vista aérea das pistas do aeroporto" 
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Temperatura do Asfalto (°C)</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={temperatureData.chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="temp" stroke="#1A73E8" fill="#1A73E8" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {temperatureData.runways.map((runway, index) => (
                <div key={index} className="rounded bg-neutral-100 dark:bg-darkbg-card p-2">
                  <div className="text-xs text-neutral-500">{runway.name}</div>
                  <div className="font-mono text-sm">{runway.temperature}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Coeficiente de Atrito</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={frictionData.chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 1]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="friction" stroke="#F9A825" fill="#F9A825" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              {frictionData.runways.map((runway, index) => (
                <div key={index} className="rounded bg-neutral-100 dark:bg-darkbg-card p-2">
                  <div className="text-xs text-neutral-500">{runway.name}</div>
                  <div className="font-mono text-sm">{runway.friction}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
