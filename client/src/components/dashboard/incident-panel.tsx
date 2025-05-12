import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from "@/contexts/dashboard-context";
import { IncidentItem } from "@/components/ui/incident-item";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function IncidentPanel() {
  const { incidents } = useDashboard();
  const [filter, setFilter] = React.useState("all");
  const [selectedIncident, setSelectedIncident] = React.useState<string | null>(null);

  const filteredIncidents = React.useMemo(() => {
    if (filter === "all") return incidents;
    return incidents.filter(incident => incident.severity === filter);
  }, [incidents, filter]);

  const handleViewDetails = (id: string) => {
    setSelectedIncident(id);
  };

  const selectedIncidentData = React.useMemo(() => {
    if (!selectedIncident) return null;
    return incidents.find(incident => incident.id === selectedIncident);
  }, [incidents, selectedIncident]);

  return (
    <>
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Painel de Incidentes</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="bg-neutral-100 dark:bg-neutral-800 border-none w-32 text-sm">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="critical">Críticos</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="info">Resolvidos</SelectItem>
                </SelectContent>
              </Select>
              <Button size="icon" variant="outline" className="p-1 bg-neutral-100 dark:bg-neutral-800">
                <span className="material-icons text-sm">filter_list</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-700 space-y-6 pb-2">
            {filteredIncidents.map(incident => (
              <IncidentItem
                key={incident.id}
                timestamp={incident.timestamp}
                title={incident.title}
                description={incident.description}
                severity={incident.severity}
                id={incident.id}
                onViewDetails={handleViewDetails}
              />
            ))}
            
            <div className="flex justify-center">
              <Button variant="link" className="text-primary">Carregar mais</Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </>
  );
}
