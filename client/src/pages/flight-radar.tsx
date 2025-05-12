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
import { cn } from "@/lib/utils";

const FLIGHT_RADAR_TOKEN = "0196c5e5-e2b3-73a9-ba18-cdb84fc6d4e7|PtB45kHJejue6Ca5VmrdFpTwItLnGvy1pXgpN1MY33c59b57";

export default function FlightRadar() {
  const { 
    currentTime,
    notificationCount
  } = useDashboard();
  
  const [view, setView] = useState<"radar" | "table">("radar");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = "GRU IOT - Flight Radar";
    
    // Simulate loading time for Flight Radar
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const formattedTime = format(currentTime, "dd/MM/yyyy - HH:mm:ss", { locale: ptBR });
  
  // Mock flight data - in a real application this would come from the FlightRadar24 API
  const flightData = [
    { 
      id: "AZU2425", 
      airline: "Azul", 
      origin: "Recife (REC)", 
      destination: "Guarulhos (GRU)",
      status: "Em aproximação",
      altitude: "5,500 ft",
      speed: "260 kts",
      aircraft: "Embraer E195",
      eta: "19:45"
    },
    { 
      id: "TAM3400", 
      airline: "LATAM", 
      origin: "Guarulhos (GRU)", 
      destination: "Brasília (BSB)",
      status: "Taxiando",
      altitude: "Ground",
      speed: "15 kts",
      aircraft: "Airbus A320",
      eta: "Decolagem em 10 min"
    },
    { 
      id: "GLO1765", 
      airline: "GOL", 
      origin: "Salvador (SSA)", 
      destination: "Guarulhos (GRU)",
      status: "Em aproximação",
      altitude: "8,200 ft",
      speed: "290 kts",
      aircraft: "Boeing 737-800",
      eta: "19:58"
    },
    { 
      id: "TAM3110", 
      airline: "LATAM", 
      origin: "Guarulhos (GRU)", 
      destination: "Porto Alegre (POA)",
      status: "Taxiando",
      altitude: "Ground",
      speed: "20 kts",
      aircraft: "Airbus A321",
      eta: "Decolagem em 5 min"
    },
    { 
      id: "AZU4517", 
      airline: "Azul", 
      origin: "Confins (CNF)", 
      destination: "Guarulhos (GRU)",
      status: "Em rota",
      altitude: "33,000 ft",
      speed: "450 kts",
      aircraft: "Airbus A320neo",
      eta: "20:15"
    },
    { 
      id: "MSC8542", 
      airline: "Mississipi Airlines", 
      origin: "Brasília (BSB)", 
      destination: "Guarulhos (GRU)",
      status: "Em rota",
      altitude: "28,000 ft",
      speed: "420 kts",
      aircraft: "Boeing 737 MAX",
      eta: "21:22"
    },
    { 
      id: "FDX8870", 
      airline: "FedEx", 
      origin: "São José Campos (SJK)", 
      destination: "Guarulhos (GRU)",
      status: "Em aproximação",
      altitude: "6,500 ft",
      speed: "210 kts",
      aircraft: "Boeing 767F",
      eta: "19:40"
    },
    { 
      id: "UAL148", 
      airline: "United Airlines", 
      origin: "Guarulhos (GRU)", 
      destination: "Houston (IAH)",
      status: "Embarcando",
      altitude: "Ground",
      speed: "0 kts",
      aircraft: "Boeing 787-9",
      eta: "Partida em 35 min"
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operador"
        currentRoute="/flightradar"
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Flight Radar 24</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Monitoramento em tempo real de voos no Aeroporto de Guarulhos</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md flex overflow-hidden">
              <button 
                className={cn(
                  "px-4 py-2 text-sm",
                  view === "radar" 
                    ? "bg-primary text-white" 
                    : "text-neutral-600 dark:text-neutral-300"
                )}
                onClick={() => setView("radar")}
              >
                <span className="material-icons text-sm mr-1">radar</span>
                Radar
              </button>
              <button 
                className={cn(
                  "px-4 py-2 text-sm",
                  view === "table" 
                    ? "bg-primary text-white" 
                    : "text-neutral-600 dark:text-neutral-300"
                )}
                onClick={() => setView("table")}
              >
                <span className="material-icons text-sm mr-1">view_list</span>
                Lista
              </button>
            </div>
            
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
        
        {view === "radar" && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Visualização do Radar</CardTitle>
                  <CardDescription>Monitoramento em tempo real da área do Aeroporto de Guarulhos</CardDescription>
                </div>
                
                <a 
                  href="https://www.flightradar24.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center"
                >
                  Powered by FlightRadar24
                  <span className="material-icons text-xs ml-1">launch</span>
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[700px] bg-neutral-100 dark:bg-darkbg-card rounded-lg overflow-hidden">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-neutral-300 border-t-primary rounded-full animate-spin"></div>
                      <div className="mt-4 text-neutral-500">Carregando dados do Flight Radar 24...</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <iframe
                      src={`https://www.flightradar24.com/simple?lat=-23.436&lon=-46.473&z=12&airports=1&token=${FLIGHT_RADAR_TOKEN}`}
                      width="100%"
                      height="100%"
                      style={{ border: "none" }}
                      title="FlightRadar24 - Área de Guarulhos"
                      className="absolute inset-0"
                    ></iframe>
                    
                    <div className="absolute bottom-4 right-4 bg-white dark:bg-neutral-800 p-3 rounded shadow text-xs space-y-1.5">
                      <div className="font-medium mb-1">Legenda</div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Chegando em GRU</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Partindo de GRU</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span>Em rota</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>No solo</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                <h3 className="font-medium mb-2">Informações Operacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-neutral-500 mb-1">Pistas Ativas</div>
                    <div>09R/27L (Principal), 09L/27R (Secundária)</div>
                  </div>
                  
                  <div>
                    <div className="text-neutral-500 mb-1">Direção de Operação</div>
                    <div>Decolagens: 09L/09R, Pousos: 27L/27R</div>
                  </div>
                  
                  <div>
                    <div className="text-neutral-500 mb-1">Fluxo</div>
                    <div>32 chegadas/hora, 28 partidas/hora</div>
                  </div>
                  
                  <div>
                    <div className="text-neutral-500 mb-1">Atrasos</div>
                    <div>Média de 15 min (chegadas), 8 min (partidas)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {view === "table" && (
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Lista de Voos</CardTitle>
                  <CardDescription>Voos chegando e partindo do Aeroporto de Guarulhos</CardDescription>
                </div>
                
                <div className="flex">
                  <Button variant="outline" size="sm" className="mr-2">
                    <span className="material-icons text-sm mr-1">flight_land</span>
                    Chegadas
                  </Button>
                  <Button variant="outline" size="sm">
                    <span className="material-icons text-sm mr-1">flight_takeoff</span>
                    Partidas
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="text-left font-medium py-2 px-2">Voo</th>
                      <th className="text-left font-medium py-2 px-2">Companhia</th>
                      <th className="text-left font-medium py-2 px-2">Origem/Destino</th>
                      <th className="text-left font-medium py-2 px-2">Status</th>
                      <th className="text-left font-medium py-2 px-2">Altitude</th>
                      <th className="text-left font-medium py-2 px-2">Velocidade</th>
                      <th className="text-left font-medium py-2 px-2">Aeronave</th>
                      <th className="text-left font-medium py-2 px-2">ETA/ETD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flightData.map((flight, index) => (
                      <tr 
                        key={index} 
                        className={cn(
                          "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                          index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                        )}
                      >
                        <td className="py-2 px-2 font-medium">{flight.id}</td>
                        <td className="py-2 px-2">{flight.airline}</td>
                        <td className="py-2 px-2">{flight.origin} → {flight.destination}</td>
                        <td className="py-2 px-2">
                          <span 
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                              flight.status === "Em aproximação" 
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300" 
                                : flight.status === "Em rota" 
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:bg-opacity-30 dark:text-purple-300"
                                  : flight.status === "Taxiando"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:bg-opacity-30 dark:text-amber-300"
                                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300"
                            )}
                          >
                            {flight.status}
                          </span>
                        </td>
                        <td className="py-2 px-2">{flight.altitude}</td>
                        <td className="py-2 px-2">{flight.speed}</td>
                        <td className="py-2 px-2">{flight.aircraft}</td>
                        <td className="py-2 px-2">{flight.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-neutral-500">
                  Mostrando 8 de 143 voos
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
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notificações ATC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-900 dark:bg-opacity-20 border-l-4 border-amber-500 rounded-lg">
                  <div className="flex items-start">
                    <span className="material-icons text-amber-500 mr-2">priority_high</span>
                    <div>
                      <div className="font-medium">Precaução com Windshear</div>
                      <div className="text-sm">Relatos de windshear leve a moderado na aproximação final das pistas 27L/27R.</div>
                      <div className="text-xs text-neutral-500 mt-1">Reportado por TAM3240 às 19:05</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border-l-4 border-blue-500 rounded-lg">
                  <div className="flex items-start">
                    <span className="material-icons text-blue-500 mr-2">info</span>
                    <div>
                      <div className="font-medium">Operação com Visibilidade Reduzida</div>
                      <div className="text-sm">Procedimentos LVP (Low Visibility Procedures) em vigor devido à visibilidade abaixo de 1000m.</div>
                      <div className="text-xs text-neutral-500 mt-1">Ativo desde 18:30</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 dark:bg-green-900 dark:bg-opacity-20 border-l-4 border-green-500 rounded-lg">
                  <div className="flex items-start">
                    <span className="material-icons text-green-500 mr-2">check_circle</span>
                    <div>
                      <div className="font-medium">Inspeção de Pista Concluída</div>
                      <div className="text-sm">Inspeção de rotina da pista 09R/27L concluída. Sem observações.</div>
                      <div className="text-xs text-neutral-500 mt-1">19:15 - Próxima inspeção às 21:15</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Condições Meteorológicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-4xl font-medium">{Math.round(25 + Math.random() * 2)}°C</div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm">Parcialmente nublado</div>
                    <div className="text-xs text-neutral-500">Sensação: {Math.round(27 + Math.random() * 2)}°C</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">Vento</div>
                    <div className="text-sm">{Math.round(10 + Math.random() * 5)} kt @ {Math.round(260 + Math.random() * 20)}°</div>
                  </div>
                  
                  <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">Visibilidade</div>
                    <div className="text-sm">{Math.round((4 + Math.random() * 2) * 10) / 10} km</div>
                  </div>
                  
                  <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">QNH</div>
                    <div className="text-sm">{1012 + Math.round(Math.random() * 4)} hPa</div>
                  </div>
                  
                  <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                    <div className="text-xs text-neutral-500 mb-1">Umidade</div>
                    <div className="text-sm">{Math.round(70 + Math.random() * 10)}%</div>
                  </div>
                </div>
                
                <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">METAR</div>
                  <div className="font-mono text-xs overflow-x-auto whitespace-nowrap">
                    SBGR 181900Z 27012G18KT 240V300 5200 -RA BR BKN010 BKN025 25/19 Q1013
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status Operacional</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Pista 09R/27L</span>
                  <span className="text-success">Operacional</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Pista 09L/27R</span>
                  <span className="text-success">Operacional</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Sistema de Iluminação</span>
                  <span className="text-critical">Falha Parcial</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-critical h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Sistemas de Navegação</span>
                  <span className="text-success">Operacional</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Radar de Superfície</span>
                  <span className="text-success">Operacional</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg mt-3">
                <div className="font-medium mb-1">Observações</div>
                <div className="text-sm">
                  <p>Falha parcial na iluminação da taxiway C. Equipe de manutenção mobilizada. Circuito de backup ativo.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer 
        version="2.1.5" 
        lastUpdate="18/05/2023" 
      />
    </div>
  );
}