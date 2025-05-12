import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/dashboard-context";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/lib/utils";

export function WeatherMonitoring() {
  const { weatherData, weatherAlerts } = useDashboard();
  const [activeTab, setActiveTab] = React.useState<'now' | 'forecast'>('now');

  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Condições Meteorológicas</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={activeTab === 'now' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('now')}
              className="text-sm"
            >
              Agora
            </Button>
            <Button 
              variant={activeTab === 'forecast' ? 'default' : 'ghost'} 
              onClick={() => setActiveTab('forecast')}
              className="text-sm"
            >
              Previsão
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-3 text-center">
            <div className="text-xs text-neutral-500 mb-1">Temperatura</div>
            <div className="text-2xl font-medium mb-1">{weatherData.temperature}°C</div>
            <div className="text-xs text-neutral-500">Sensação: {weatherData.feelsLike}°C</div>
          </div>
          <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-3 text-center">
            <div className="text-xs text-neutral-500 mb-1">Umidade</div>
            <div className="text-2xl font-medium mb-1">{weatherData.humidity}%</div>
            <div className="text-xs text-neutral-500">Ponto orv.: {weatherData.dewPoint}°C</div>
          </div>
          <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-3 text-center">
            <div className="text-xs text-neutral-500 mb-1">Visibilidade</div>
            <div className="text-2xl font-medium mb-1">{weatherData.visibility} km</div>
            <div className={cn("text-xs", weatherData.visibilityStatus === "reduced" ? "text-warning" : "text-success")}>
              {weatherData.visibilityStatus === "reduced" ? "Reduzida" : "Normal"}
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-3 text-center">
            <div className="text-xs text-neutral-500 mb-1">QNH</div>
            <div className="text-2xl font-medium mb-1">{weatherData.qnh}</div>
            <div className="text-xs text-neutral-500">{weatherData.qnhTrend}</div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Vento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 dark:bg-darkbg-card rounded-lg p-3 flex items-center">
              <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mr-3">
                <span 
                  className="material-icons transform" 
                  style={{ transform: `rotate(${weatherData.windDirection}deg)` }}
                >
                  navigation
                </span>
              </div>
              <div>
                <div className="text-xl font-medium">{weatherData.windDirection}° / {weatherData.windSpeed} kt</div>
                <div className="text-xs text-neutral-500">Rajadas: {weatherData.windGust} kt</div>
              </div>
            </div>
            <div className="h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weatherData.windHistory}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="speed" stroke="#1A73E8" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Alertas Meteorológicos</h3>
          {weatherAlerts.map((alert, index) => (
            <div 
              key={index} 
              className={cn(
                "border-l-4 p-3 rounded-lg mb-2 flex items-start",
                alert.type === "warning" 
                  ? "bg-warning bg-opacity-10 border-warning" 
                  : "bg-neutral-100 dark:bg-darkbg-card border-neutral-300 dark:border-neutral-700"
              )}
            >
              <span className={cn(
                "material-icons mr-2", 
                alert.type === "warning" ? "text-warning" : "text-neutral-500"
              )}>
                {alert.icon}
              </span>
              <div>
                <div className="font-medium">{alert.title}</div>
                <div className="text-sm">{alert.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
