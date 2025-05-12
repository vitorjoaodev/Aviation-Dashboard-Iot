import React from "react";
import { cn } from "@/lib/utils";

export type StatusType = "operational" | "warning" | "critical";

interface StatusCardProps {
  title: string;
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

const statusColors = {
  operational: "border-success",
  warning: "border-warning",
  critical: "border-critical",
};

const statusTexts = {
  operational: "Operacional",
  warning: "Atenção",
  critical: "Falha",
};

const statusBgColors = {
  operational: "bg-success bg-opacity-20 text-success",
  warning: "bg-warning bg-opacity-20 text-warning-dark dark:text-warning",
  critical: "bg-critical bg-opacity-20 text-critical",
};

export function StatusCard({ title, status, children, className }: StatusCardProps) {
  return (
    <div className={cn("bg-neutral-50 dark:bg-darkbg-card rounded-lg p-4 border-l-4", statusColors[status], className)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm text-neutral-600 dark:text-neutral-300">{title}</h3>
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", statusBgColors[status])}>
          {statusTexts[status]}
        </span>
      </div>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}
