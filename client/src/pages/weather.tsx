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
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

export default function Weather() {
  const { 
    weatherData, 
    weatherAlerts,
    currentTime,
    notificationCount
  } = useDashboard();
  
  const [activeTab, setActiveTab] = useState("current");
  
  useEffect(() => {
    document.title = "GRU IOT - Weather Monitoring";
  }, []);

  const formattedTime = format(currentTime, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });

  // Generate historical weather data for charts
  const temperatureHistory = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    temperature: Math.round((23 + Math.sin(i/3) * 4 + Math.random() * 1) * 10) / 10
  })).reverse();
  
  const pressureHistory = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    pressure: Math.round((1013 + Math.sin(i/8) * 2 + Math.random() * 0.5) * 10) / 10
  })).reverse();
  
  const humidityHistory = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    humidity: Math.round((70 + Math.sin(i/4) * 10 + Math.random() * 5) * 10) / 10
  })).reverse();
  
  const visibilityHistory = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    visibility: Math.round((8 + Math.sin(i/6) * 3 + Math.random() * 1) * 10) / 10
  })).reverse();
  
  const precipitationHistory = Array.from({ length: 24 }, (_, i) => ({
    time: format(new Date(Date.now() - i * 3600000), "HH:mm"),
    precipitation: Math.round(Math.max(0, Math.sin(i/4) * 5 + Math.random() * 1) * 10) / 10
  })).reverse();
  
  // Mock weather forecast data
  const forecast = [
    { day: "Hoje", date: "18/05", highTemp: 26, lowTemp: 19, condition: "cloud", precipitation: 60, humidity: 75, wind: 12 },
    { day: "Amanhã", date: "19/05", highTemp: 25, lowTemp: 18, condition: "cloud_sun", precipitation: 30, humidity: 70, wind: 10 },
    { day: "Sábado", date: "20/05", highTemp: 27, lowTemp: 19, condition: "sun", precipitation: 10, humidity: 65, wind: 8 },
    { day: "Domingo", date: "21/05", highTemp: 28, lowTemp: 20, condition: "sun", precipitation: 0, humidity: 60, wind: 6 },
    { day: "Segunda", date: "22/05", highTemp: 29, lowTemp: 21, condition: "sun", precipitation: 0, humidity: 55, wind: 7 }
  ];
  
  // Lightning detection data
  const lightningData = [
    { id: "LTG-1293", timestamp: "19:05 - 18/05/2023", distance: "15km", direction: "Sul", intensity: "Moderada" },
    { id: "LTG-1292", timestamp: "19:01 - 18/05/2023", distance: "16km", direction: "Sul", intensity: "Moderada" },
    { id: "LTG-1291", timestamp: "18:58 - 18/05/2023", distance: "17km", direction: "Sul", intensity: "Moderada" },
    { id: "LTG-1290", timestamp: "18:55 - 18/05/2023", distance: "18km", direction: "Sul", intensity: "Fraca" },
    { id: "LTG-1289", timestamp: "18:52 - 18/05/2023", distance: "19km", direction: "Sul", intensity: "Fraca" }
  ];
  
  // Get appropriate weather icon based on condition string
  const getWeatherIcon = (condition: string) => {
    switch(condition) {
      case "sun": return "wb_sunny";
      case "cloud_sun": return "partly_cloudy_day";
      case "cloud": return "cloud";
      case "rain": return "rainy";
      case "thunder": return "thunderstorm";
      default: return "help";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operador"
        currentRoute="/meteorologia"
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Monitoramento Meteorológico</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Dados meteorológicos em tempo real e previsões para o aeroporto</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-neutral-100 dark:bg-neutral-800"
            >
              <span className="material-icons text-sm mr-1">file_download</span>
              Exportar Dados
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-neutral-100 dark:bg-neutral-800"
            >
              <span className="material-icons text-sm mr-1">refresh</span>
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="current">Condições Atuais</TabsTrigger>
            <TabsTrigger value="historical">Histórico</TabsTrigger>
            <TabsTrigger value="forecast">Previsão</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Condições Meteorológicas Atuais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <div className="flex flex-col items-center">
                        <div className="text-5xl font-bold mb-1">{weatherData.temperature}°C</div>
                        <div className="text-neutral-500 dark:text-neutral-400 mb-4">Sensação térmica: {weatherData.feelsLike}°C</div>
                        <div className="flex justify-center gap-8 text-center">
                          <div>
                            <div className="text-neutral-500 dark:text-neutral-400 text-sm">Umidade</div>
                            <div className="flex items-center">
                              <span className="material-icons text-sm mr-1">water_drop</span>
                              <span>{weatherData.humidity}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-neutral-500 dark:text-neutral-400 text-sm">Ponto de Orvalho</div>
                            <div>{weatherData.dewPoint}°C</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <div className="mb-4">
                        <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Vento</div>
                        <div className="flex items-center">
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
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">Rajadas: {weatherData.windGust} kt</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">Visibilidade</div>
                          <div className="flex items-center">
                            <span className="material-icons text-sm mr-1">visibility</span>
                            <span>{weatherData.visibility} km</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">QNH</div>
                          <div>{weatherData.qnh} hPa</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Histórico de Vento (última hora)</h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={weatherData.windHistory}
                          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 20]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="speed" 
                            stroke="#1A73E8" 
                            dot={false} 
                            name="Velocidade (kt)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alertas Meteorológicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weatherAlerts.length > 0 ? (
                    weatherAlerts.map((alert, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "border-l-4 p-3 rounded-lg flex items-start",
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
                    ))
                  ) : (
                    <div className="text-center p-4">
                      <span className="material-icons text-3xl text-neutral-400 mb-2">check_circle</span>
                      <p>Nenhum alerta meteorológico ativo no momento.</p>
                    </div>
                  )}
                  
                  <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Sistema de Detecção de Raios</h3>
                    
                    <div className="mb-3">
                      <div className="flex items-center mb-1">
                        <span className="material-icons text-sm mr-1 text-warning">flash_on</span>
                        <span className="font-medium">Atividade Detectada</span>
                      </div>
                      <div className="text-sm">
                        <p>Distância mínima: 15km ao Sul</p>
                        <p>Tendência: Aproximando-se</p>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-block relative">
                        <div className="w-40 h-40 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            </div>
                          </div>
                          
                          {/* Lightning indicators */}
                          <div className="absolute bottom-4 w-2 h-2 bg-warning rounded-full animate-ping"></div>
                          <div className="absolute bottom-6 left-8 w-2 h-2 bg-warning rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                          <div className="absolute bottom-2 left-12 w-2 h-2 bg-warning rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                        </div>
                        
                        {/* Direction markers */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">N</div>
                        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-xs font-medium">L</div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs font-medium">S</div>
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">O</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">METAR/TAF Atuais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-2">METAR</h3>
                    <div className="font-mono text-sm bg-neutral-200 dark:bg-neutral-800 p-3 rounded">
                      SBGR 181900Z 27012G18KT 240V300 5200 -RA BR BKN010 BKN025 25/19 Q1013 TEMPO 4000 RA BKN008
                    </div>
                    <div className="mt-2 text-xs text-right text-neutral-500">
                      Última atualização: 19:00Z
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-2">TAF</h3>
                    <div className="font-mono text-sm bg-neutral-200 dark:bg-neutral-800 p-3 rounded">
                      SBGR 181700Z 1818/1924 27010KT 9999 SCT035 TX28/1918Z TN18/1810Z<br />
                      TEMPO 1818/1824 27015G25KT 4000 RA BKN010<br />
                      BECMG 1900/1902 VRB04KT 6000 -RA BR<br />
                      TEMPO 1908/1914 12008KT 8000 NSW
                    </div>
                    <div className="mt-2 text-xs text-right text-neutral-500">
                      Válido: 18/17:00Z - 19/24:00Z
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="link" className="text-primary text-sm">
                    Ver histórico completo de METARs/TAFs
                    <span className="material-icons text-sm ml-1">arrow_forward</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historical" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Temperatura (°C) - Últimas 24 horas</CardTitle>
                    <Button variant="outline" size="sm" className="bg-neutral-100 dark:bg-neutral-800">
                      <span className="material-icons text-sm mr-1">file_download</span>
                      CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={temperatureHistory}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="time" />
                        <YAxis domain={[15, 30]} />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#1A73E8" 
                          fill="#1A73E8" 
                          fillOpacity={0.2} 
                          name="Temperatura (°C)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Pressão Atmosférica (hPa)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={pressureHistory}
                          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[1008, 1018]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="pressure" 
                            stroke="#F9A825" 
                            dot={false}
                            name="QNH (hPa)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Umidade Relativa (%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={humidityHistory}
                          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[40, 100]} />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="humidity" 
                            stroke="#7E57C2" 
                            fill="#7E57C2" 
                            fillOpacity={0.2}
                            name="Umidade (%)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Visibilidade (km)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={visibilityHistory}
                          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 12]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="visibility" 
                            stroke="#26A69A" 
                            dot={false}
                            name="Visibilidade (km)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Precipitação (mm/h)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={precipitationHistory}
                          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 6]} />
                          <Tooltip />
                          <Bar 
                            dataKey="precipitation" 
                            fill="#42A5F5" 
                            name="Precipitação (mm/h)"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Previsão Meteorológica - 5 dias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <div 
                      key={index} 
                      className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg text-center"
                    >
                      <div className="font-medium">{day.day}</div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{day.date}</div>
                      
                      <div className="mb-2">
                        <span className="material-icons text-4xl">
                          {getWeatherIcon(day.condition)}
                        </span>
                      </div>
                      
                      <div className="flex justify-center gap-2 mb-3">
                        <span className="font-medium">{day.highTemp}°</span>
                        <span className="text-neutral-500 dark:text-neutral-400">{day.lowTemp}°</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div>
                          <div className="text-neutral-500 dark:text-neutral-400">Chuva</div>
                          <div className="flex items-center justify-center">
                            <span className="material-icons text-xs mr-0.5">water_drop</span>
                            <span>{day.precipitation}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-neutral-500 dark:text-neutral-400">Umid</div>
                          <div>{day.humidity}%</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 dark:text-neutral-400">Vento</div>
                          <div>{day.wind}kt</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <h3 className="font-medium mb-3">Previsão para Hoje - Detalhada</h3>
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-8 gap-4 min-w-[800px]">
                      {Array.from({ length: 8 }, (_, i) => {
                        const hour = (i + 13) % 24;
                        const showTime = `${hour}:00`;
                        const temp = Math.round((25 + Math.sin(i/3) * 3) * 10) / 10;
                        const precip = Math.max(0, Math.round((Math.sin(i/2) * 60 + 20) * 10) / 10);
                        const wind = Math.round((10 + Math.sin(i/4) * 4) * 10) / 10;
                        
                        return (
                          <div key={i} className="text-center">
                            <div className="font-medium">{showTime}</div>
                            <div className="my-2">
                              <span className="material-icons text-2xl">
                                {i < 3 ? "cloud" : i < 5 ? "cloud_sun" : "sun"}
                              </span>
                            </div>
                            <div className="font-medium mb-2">{temp}°C</div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                              <div>Chuva: {precip}%</div>
                              <div>Vento: {wind}kt</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Meteorologia por Satélite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                  <div className="relative w-full h-96 rounded-lg overflow-hidden">
                    <iframe 
                      src="https://embed.windy.com/embed2.html?lat=-23.432&lon=-46.469&zoom=8&level=surface&overlay=radar&menu=&message=true&marker=&calendar=&pressure=&type=map&location=coordinates&detail=&detailLat=-23.432&detailLon=-46.469&metricWind=kt&metricTemp=%C2%B0C" 
                      width="100%" 
                      height="100%"
                      className="border-0"
                      title="Mapa meteorológico em tempo real - Windy.com"
                    ></iframe>
                    
                    <div className="absolute bottom-4 right-4 bg-white dark:bg-darkbg-card p-2 text-xs rounded shadow">
                      <div className="font-medium mb-1">Legenda</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 mr-1"></div>
                          <span>Chuva fraca</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
                          <span>Chuva moderada</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-orange-500 mr-1"></div>
                          <span>Chuva forte</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 mr-1"></div>
                          <span>Tempestade</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alertas Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  {weatherAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {weatherAlerts.map((alert, index) => (
                        <div 
                          key={index} 
                          className={cn(
                            "border-l-4 p-4 rounded-lg",
                            alert.type === "warning" 
                              ? "bg-warning bg-opacity-10 border-warning" 
                              : "bg-neutral-100 dark:bg-darkbg-card border-neutral-300 dark:border-neutral-700"
                          )}
                        >
                          <div className="flex items-start">
                            <span className={cn(
                              "material-icons mr-2 mt-0.5", 
                              alert.type === "warning" ? "text-warning" : "text-neutral-500"
                            )}>
                              {alert.icon}
                            </span>
                            <div>
                              <div className="font-medium">{alert.title}</div>
                              <div className="text-sm mt-1">{alert.description}</div>
                              
                              <div className="flex justify-between items-center mt-3 text-sm">
                                <div className="text-neutral-500 dark:text-neutral-400">
                                  Emitido: {format(new Date(), "HH:mm - dd/MM/yyyy", { locale: ptBR })}
                                </div>
                                <Button variant="outline" size="sm" className="h-7 rounded-full">
                                  Detalhes
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <span className="material-icons text-4xl text-neutral-400 mb-3">check_circle</span>
                      <h3 className="text-lg font-medium mb-1">Nenhum alerta ativo</h3>
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Não há alertas meteorológicos ativos no momento.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Sistema de Detecção de Raios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Atividade Elétrica</h3>
                      <div className="text-center">
                        <div className="inline-block relative mb-4">
                          <div className="w-56 h-56 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                              <div className="w-24 h-24 rounded-full border-2 border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                              </div>
                            </div>
                            
                            {/* Lightning indicators */}
                            <div className="absolute bottom-8 w-2 h-2 bg-warning rounded-full animate-ping"></div>
                            <div className="absolute bottom-12 left-12 w-2 h-2 bg-warning rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                            <div className="absolute bottom-4 left-16 w-2 h-2 bg-warning rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                            
                            {/* Range markers */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs">30km</div>
                            <div className="absolute top-[18%] left-[82%] text-xs">20km</div>
                            <div className="absolute top-1/2 left-[17%] -translate-y-1/2 text-xs">10km</div>
                          </div>
                          
                          {/* Direction markers */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">N</div>
                          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 text-xs font-medium">L</div>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-xs font-medium">S</div>
                          <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">O</div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2 text-center text-sm mb-4">
                          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">0-5km</div>
                            <div className="font-medium">0</div>
                          </div>
                          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">5-10km</div>
                            <div className="font-medium">0</div>
                          </div>
                          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">10-20km</div>
                            <div className="font-medium">2</div>
                          </div>
                          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">20-30km</div>
                            <div className="font-medium">5</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Histórico de Detecções</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-neutral-200 dark:border-neutral-700">
                              <th className="text-left font-medium py-2 pl-2">ID</th>
                              <th className="text-left font-medium py-2">Timestamp</th>
                              <th className="text-left font-medium py-2">Distância</th>
                              <th className="text-left font-medium py-2">Direção</th>
                              <th className="text-left font-medium py-2">Intensidade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lightningData.map((log, index) => (
                              <tr 
                                key={index} 
                                className={cn(
                                  "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                                  index % 2 === 0 ? "bg-neutral-100 dark:bg-neutral-800" : ""
                                )}
                              >
                                <td className="py-2 pl-2">{log.id}</td>
                                <td className="py-2">{log.timestamp}</td>
                                <td className="py-2">{log.distance}</td>
                                <td className="py-2">{log.direction}</td>
                                <td className="py-2">{log.intensity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Configuração de Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Alertas de Vento</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Vento Sustentado (acima de 20kt)</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={true}
                            className="sr-only peer" 
                            id="wind-alert-1" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Rajadas (acima de 25kt)</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={true}
                            className="sr-only peer" 
                            id="wind-alert-2" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Mudança de direção (acima de 30°)</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={false}
                            className="sr-only peer" 
                            id="wind-alert-3" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Alertas de Visibilidade/Temporal</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Visibilidade (abaixo de 5km)</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={true}
                            className="sr-only peer" 
                            id="vis-alert-1" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Raios dentro de 10km</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={true}
                            className="sr-only peer" 
                            id="vis-alert-2" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Precipitação (acima de 5mm/h)</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={true}
                            className="sr-only peer" 
                            id="vis-alert-3" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 dark:bg-darkbg-card p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Configurações de Notificação</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Notificações na Tela</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={true}
                            className="sr-only peer" 
                            id="notif-1" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Alerta Sonoro</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={true}
                            className="sr-only peer" 
                            id="notif-2" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Enviar Email</span>
                        <div className="relative inline-flex items-center">
                          <input 
                            type="checkbox" 
                            defaultChecked={false}
                            className="sr-only peer" 
                            id="notif-3" 
                          />
                          <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button>Salvar Configurações</Button>
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