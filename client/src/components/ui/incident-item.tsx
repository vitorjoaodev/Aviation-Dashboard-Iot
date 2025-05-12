import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type IncidentSeverity = "critical" | "warning" | "info";

interface IncidentItemProps {
  timestamp: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  id: string;
  onViewDetails: (id: string) => void;
}

const severityColors: Record<IncidentSeverity, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  info: "bg-neutral-400",
};

const severityLabels: Record<IncidentSeverity, string> = {
  critical: "Crítico",
  warning: "Atenção",
  info: "Informativo",
};

const severityBadgeStyles: Record<IncidentSeverity, string> = {
  critical: "bg-critical bg-opacity-20 text-critical",
  warning: "bg-warning bg-opacity-20 text-warning-dark dark:text-warning",
  info: "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300",
};

export function IncidentItem({ timestamp, title, description, severity, id, onViewDetails }: IncidentItemProps) {
  return (
    <div className="relative">
      <div className={cn("absolute -left-9 top-0 w-4 h-4 rounded-full border-2 border-white dark:border-darkbg-paper", severityColors[severity])}></div>
      <div className="mb-1">
        <span className="text-xs text-neutral-500">{timestamp}</span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="p-3 bg-neutral-50 dark:bg-darkbg-card rounded-lg">
        <div className="text-sm mb-2">{description}</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", severityBadgeStyles[severity])}>
              {severityLabels[severity]}
            </span>
            <span className="text-xs text-neutral-500">ID: #{id}</span>
          </div>
          <Button 
            variant="link" 
            className="text-primary text-xs p-0 h-auto" 
            onClick={() => onViewDetails(id)}
          >
            Ver detalhes
          </Button>
        </div>
      </div>
    </div>
  );
}
