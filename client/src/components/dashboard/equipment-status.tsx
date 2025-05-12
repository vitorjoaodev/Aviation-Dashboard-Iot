import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/dashboard-context";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EquipmentStatus() {
  const { equipmentStatus, refreshData } = useDashboard();

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Equipamentos Críticos</CardTitle>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={refreshData} 
            className="p-1 bg-neutral-100 dark:bg-neutral-800"
          >
            <span className="material-icons text-sm">refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[375px] pr-4">
          {equipmentStatus.map((item) => (
            <div 
              key={item.id} 
              className="border-b border-neutral-100 dark:border-neutral-800 pb-2 mb-2 last:border-0"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="font-medium">{item.name}</div>
                <span 
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-opacity-20", 
                    item.status === "operational" 
                      ? "bg-success text-success" 
                      : item.status === "warning"
                        ? "bg-warning text-warning-dark dark:text-warning" 
                        : "bg-critical text-critical"
                  )}
                >
                  {item.status === "operational" 
                    ? "Operacional" 
                    : item.status === "warning" 
                      ? "Atenção" 
                      : "Falha"}
                </span>
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">{item.location}</div>
              <div className="text-xs text-neutral-500">{item.lastUpdate}</div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
