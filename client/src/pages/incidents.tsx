import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
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

  const formattedTime = format(currentTime, "MM/dd/yyyy - HH:mm:ss", { locale: enUS });
  
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
  
  // Mock historical incidents data - TRANSLATED
  const pastIncidents = [
    { id: "FOD-2769", timestamp: "09:12 - 05/17/2023", title: "FOD reported on runway 09R", severity: "warning" as IncidentSeverity, status: "Completed" },
    { id: "OPS-5518", timestamp: "14:35 - 05/16/2023", title: "Aircraft reported issues with approach lights", severity: "critical" as IncidentSeverity, status: "Completed" },
    { id: "WX-1122", timestamp: "10:28 - 05/16/2023", title: "Lightning detected at 8km - Outdoor activities suspended", severity: "critical" as IncidentSeverity, status: "Completed" },
    { id: "EQP-3378", timestamp: "08:15 - 05/15/2023", title: "Secondary radar failure - Backup activated", severity: "warning" as IncidentSeverity, status: "Completed" },
    { id: "OPS-5515", timestamp: "15:40 - 05/14/2023", title: "Routine inspection completed - All runways", severity: "info" as IncidentSeverity, status: "Completed" },
    { id: "EQP-3375", timestamp: "11:22 - 05/14/2023", title: "Preventive maintenance on PAPI system", severity: "info" as IncidentSeverity, status: "Completed" },
  ];
  
  // Response protocol data - TRANSLATED
  const responseProtocols = [
    { id: "RP-001", name: "FOD Protocol", type: "Safety", description: "Procedures for detection and removal of foreign objects on runways", lastUpdated: "05/01/2023" },
    { id: "RP-002", name: "Adverse Weather Conditions Protocol", type: "Meteorology", description: "Mitigation actions for storms, lightning and reduced visibility", lastUpdated: "04/15/2023" },
    { id: "RP-003", name: "Critical Equipment Failure Protocol", type: "Technical", description: "Procedures for failures in lighting systems, radars and communication", lastUpdated: "05/03/2023" },
    { id: "RP-004", name: "Emergency Evacuation Protocol", type: "Safety", description: "Procedures for evacuation of specific airport areas", lastUpdated: "04/28/2023" },
    { id: "RP-005", name: "Power Failure Protocol", type: "Technical", description: "Actions for main power system failures and backup activation", lastUpdated: "05/10/2023" },
  ];
  
  // Emergency contacts - TRANSLATED
  const emergencyContacts = [
    { name: "Airport Operations Center", phone: "11 2445-2945", email: "cop@guarulhos.aero", responseTime: "Immediate" },
    { name: "Technical Team (24h)", phone: "11 2445-3050", email: "tecnico@guarulhos.aero", responseTime: "< 5 min" },
    { name: "Maintenance", phone: "11 2445-3122", email: "manutencao@guarulhos.aero", responseTime: "< 15 min" },
    { name: "Fire Department", phone: "11 2445-2988", email: "bombeiros@guarulhos.aero", responseTime: "< 3 min" },
    { name: "Security", phone: "11 2445-2999", email: "seguranca@guarulhos.aero", responseTime: "< 5 min" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentTime={formattedTime} 
        notificationCount={notificationCount}
        userName="Operator"
        currentRoute="/incidents"
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Incident Management</h1>
            <p className="text-neutral-500 dark:text-neutral-400">Monitoring and management of airport operational incidents</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button>
              <span className="material-icons text-sm mr-1">add</span>
              New Incident
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Incident Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Critical", value: statusCounts.critical, color: "#F44336" },
                        { name: "Warning", value: statusCounts.warning, color: "#FFC107" },
                        { name: "Informational", value: statusCounts.info, color: "#607D8B" }
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
                        { name: "Critical", value: statusCounts.critical, color: "#F44336" },
                        { name: "Warning", value: statusCounts.warning, color: "#FFC107" },
                        { name: "Informational", value: statusCounts.info, color: "#607D8B" }
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
                  <div className="text-xs text-neutral-500 mb-1">Critical</div>
                  <div className="font-medium text-critical">{statusCounts.critical}</div>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Warning</div>
                  <div className="font-medium text-warning">{statusCounts.warning}</div>
                </div>
                <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                  <div className="text-xs text-neutral-500 mb-1">Informational</div>
                  <div className="font-medium text-neutral-500">{statusCounts.info}</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium mb-1">Average response time</h3>
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
                  <span>Target: {analysisData.responseTimeStats.target} min</span>
                  <span>Best: {analysisData.responseTimeStats.best} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Active Incidents</CardTitle>
                <div className="flex items-center space-x-2">
                  <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-neutral-100 dark:bg-neutral-800 rounded-md border-none py-1 pl-2 pr-4 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Informational</option>
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
                    <p>No active incidents with current filters.</p>
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Button variant="link" className="text-primary">Load more</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="active">All Incidents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="protocols">Response Protocols</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Incident List</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <span className="material-icons text-neutral-400 text-sm">search</span>
                      </span>
                      <input
                        className="bg-neutral-100 dark:bg-neutral-800 py-1 pl-8 pr-4 rounded-md w-64 text-sm placeholder:text-neutral-400"
                        placeholder="Search incidents..."
                        type="text"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-neutral-100 dark:bg-neutral-800"
                    >
                      <span className="material-icons text-sm mr-1">file_download</span>
                      Export
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
                        <th className="text-left font-medium py-2 px-2">Title</th>
                        <th className="text-left font-medium py-2 px-2">Severity</th>
                        <th className="text-left font-medium py-2 px-2">Status</th>
                        <th className="text-left font-medium py-2 px-2">Actions</th>
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
                              {incident.severity === "critical" ? "Critical" : incident.severity === "warning" ? "Warning" : "Informational"}
                            </Badge>
                          </td>
                          <td className="py-2 px-2">{incident.status || "Analyzing"}</td>
                          <td className="py-2 px-2">
                            <div className="flex space-x-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 px-2"
                                onClick={() => setSelectedIncident(incident.id)}
                              >
                                <span className="material-icons text-sm">visibility</span>
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
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Incident History</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <span className="material-icons text-neutral-400 text-sm">search</span>
                      </span>
                      <input
                        className="bg-neutral-100 dark:bg-neutral-800 py-1 pl-8 pr-4 rounded-md w-64 text-sm placeholder:text-neutral-400"
                        placeholder="Search in history..."
                        type="text"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-neutral-100 dark:bg-neutral-800"
                    >
                      <span className="material-icons text-sm mr-1">filter_list</span>
                      Filter
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
                        <th className="text-left font-medium py-2 px-2">Title</th>
                        <th className="text-left font-medium py-2 px-2">Severity</th>
                        <th className="text-left font-medium py-2 px-2">Status</th>
                        <th className="text-left font-medium py-2 px-2">Actions</th>
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
                              {incident.severity === "critical" ? "Critical" : incident.severity === "warning" ? "Warning" : "Informational"}
                            </Badge>
                          </td>
                          <td className="py-2 px-2">{incident.status}</td>
                          <td className="py-2 px-2">
                            <div className="flex space-x-1">
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <span className="material-icons text-sm">visibility</span>
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-2">
                                <span className="material-icons text-sm">description</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm">Load More</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="protocols" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Response Protocols</CardTitle>
                  <Button variant="outline" size="sm" className="bg-neutral-100 dark:bg-neutral-800">
                    <span className="material-icons text-sm mr-1">add</span>
                    New Protocol
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {responseProtocols.map(protocol => (
                    <Card key={protocol.id} className="border border-neutral-200 dark:border-neutral-700">
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">{protocol.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">{protocol.type} • Last updated: {protocol.lastUpdated}</CardDescription>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="material-icons">more_vert</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-sm text-neutral-700 dark:text-neutral-300">{protocol.description}</p>
                        <div className="flex justify-end mt-3">
                          <Button variant="outline" size="sm" className="h-8">
                            <span className="material-icons text-sm mr-1">visibility</span>
                            View details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {emergencyContacts.map((contact, index) => (
                      <li 
                        key={index} 
                        className={cn(
                          "p-3 rounded-md text-sm",
                          index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                        )}
                      >
                        <div className="font-medium">{contact.name}</div>
                        <div className="flex justify-between mt-1 text-neutral-600 dark:text-neutral-400">
                          <div>{contact.phone}</div>
                          <div>Response: {contact.responseTime}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Protocol Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Critical Equipment Failure Protocol</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                        <li>Immediate notification to Airport Operations Center</li>
                        <li>Activation of backup systems when applicable</li>
                        <li>Priority technician dispatch (max 5 minutes)</li>
                        <li>Mandatory regular updates (every 15 minutes)</li>
                        <li>Coordination with ATC for operational adjustments</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Adverse Weather Protocol</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm ml-2">
                        <li>Continuous monitoring of meteorological systems</li>
                        <li>Alert issuance at T-60, T-30, and T-15 minutes</li>
                        <li>Suspension of outdoor activities when lightning detected &lt;10km</li>
                        <li>Enhanced runway monitoring during precipitation</li>
                        <li>Activation of reduced visibility procedures when applicable</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Incidents by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analysisData.incidentsByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {analysisData.incidentsByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-sm font-medium mb-1">Total incidents</div>
                      <div className="text-2xl font-semibold">{analysisData.totalIncidents}</div>
                    </div>
                    <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
                      <div className="text-sm font-medium mb-1">Avg. response time</div>
                      <div className="text-2xl font-semibold">{analysisData.responseTimeStats.average} min</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Response Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analysisData.responseTime}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} min`, 'Response Time']} />
                        <Bar dataKey="value" fill="#2E7D32" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg text-center">
                      <div className="text-xs text-neutral-500 mb-1">Best time</div>
                      <div className="font-medium text-success">{analysisData.responseTimeStats.best} min</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg text-center">
                      <div className="text-xs text-neutral-500 mb-1">Average</div>
                      <div className="font-medium">{analysisData.responseTimeStats.average} min</div>
                    </div>
                    <div className="p-2 bg-neutral-50 dark:bg-darkbg-card rounded-lg text-center">
                      <div className="text-xs text-neutral-500 mb-1">Target</div>
                      <div className="font-medium">{analysisData.responseTimeStats.target} min</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Incident Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={analysisData.incidentTrend}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="critical" stroke="#D50000" name="Critical" />
                    <Line type="monotone" dataKey="warning" stroke="#FF6D00" name="Warning" />
                    <Line type="monotone" dataKey="info" stroke="#2979FF" name="Informational" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Predictive Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="text-left font-medium py-2 px-3">Equipment</th>
                        <th className="text-left font-medium py-2 px-3">Risk Prediction</th>
                        <th className="text-left font-medium py-2 px-3">Reason</th>
                        <th className="text-left font-medium py-2 px-3">Status</th>
                        <th className="text-right font-medium py-2 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisData.maintenancePredictions.map((item, index) => (
                        <tr 
                          key={index} 
                          className={cn(
                            "border-b border-neutral-200 dark:border-neutral-700 last:border-0",
                            index % 2 === 0 ? "bg-neutral-50 dark:bg-darkbg-card" : ""
                          )}
                        >
                          <td className="py-3 px-3">{item.equipment}</td>
                          <td className="py-3 px-3">{item.prediction}</td>
                          <td className="py-3 px-3 max-w-[300px] truncate">{item.reason}</td>
                          <td className="py-3 px-3">
                            <Badge
                              className={cn(
                                item.status === "Scheduled" 
                                  ? "bg-success" 
                                  : item.status === "Pending" 
                                    ? "bg-warning text-black" 
                                    : "bg-neutral-500"
                              )}
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button variant="outline" size="sm">View details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog 
          open={!!selectedIncidentData} 
          onOpenChange={(open) => !open && setSelectedIncident(null)}
        >
          {selectedIncidentData && (
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      selectedIncidentData.severity === "critical" 
                        ? "bg-critical" 
                        : selectedIncidentData.severity === "warning" 
                          ? "bg-warning text-black" 
                          : "bg-neutral-500"
                    )}
                  >
                    {selectedIncidentData.severity === "critical" ? "Critical" : 
                     selectedIncidentData.severity === "warning" ? "Warning" : "Informational"}
                  </Badge>
                  <span>Incident {selectedIncidentData.id}</span>
                </DialogTitle>
                <DialogDescription className="text-neutral-500">
                  Reported: {selectedIncidentData.timestamp}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-1">{selectedIncidentData.title}</h3>
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                    {selectedIncidentData.description}
                  </p>
                </div>
                
                {selectedIncidentData.actions && selectedIncidentData.actions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Actions Taken</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedIncidentData.actions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-neutral-50 dark:bg-darkbg-card p-3 rounded-md">
                  <h4 className="font-medium mb-2">Status</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{selectedIncidentData.status || "Analyzing"}</span>
                    <Badge variant="outline" className="ml-auto">Open</Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <span className="material-icons text-sm">access_time</span>
                  <span>Last update: 10 minutes ago</span>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedIncident(null)}>Close</Button>
                <Button>Update Status</Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </main>
      
      <Footer version="1.2.0" lastUpdate="05/12/2023" />
    </div>
  )
}