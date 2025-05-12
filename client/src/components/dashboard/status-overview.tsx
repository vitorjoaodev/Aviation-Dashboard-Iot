import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusCard } from "@/components/ui/status-card";
import { useDashboard } from "@/contexts/dashboard-context";

export function StatusOverview() {
  const { statusItems, refreshData, timeRange, setTimeRange } = useDashboard();

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between">
          <CardTitle className="text-xl">Status Operacional</CardTitle>
          <div className="flex space-x-2 text-sm">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-neutral-100 dark:bg-neutral-800 border-none w-32">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Tempo Real</SelectItem>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="outline" onClick={refreshData} className="p-1 bg-neutral-100 dark:bg-neutral-800">
              <span className="material-icons text-sm">refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {statusItems.map((item) => (
            <StatusCard 
              key={item.id} 
              title={item.title} 
              status={item.status}
            >
              {item.metrics.map((metric, idx) => (
                <div key={idx} className="flex justify-between text-sm mb-1 last:mb-0">
                  <span>{metric.label}:</span>
                  <span className="font-mono">{metric.value}</span>
                </div>
              ))}
            </StatusCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
