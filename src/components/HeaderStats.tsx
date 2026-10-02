"use client";

import React from "react";
import { Activity, CheckCircle2, Cpu, KeySquare } from "lucide-react";

interface HeaderStatsProps {
  totalActions: number;
  activeBindings: number;
  sessionDuration: string;
  botStatus: string;
}

export function HeaderStats({
  totalActions,
  activeBindings,
  sessionDuration,
  botStatus,
}: HeaderStatsProps) {
  const stats = [
    {
      label: "Gateway Status",
      value: botStatus === "connected" ? "Operational" : botStatus.toUpperCase(),
      subtext: "SSL / Server-side auth",
      icon: Cpu,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
    {
      label: "Active Bindings",
      value: activeBindings.toString(),
      subtext: "Registered tools & targets",
      icon: KeySquare,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      label: "Actions Handled",
      value: totalActions.toString(),
      subtext: "Web bridge throughput",
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Session Integrity",
      value: "Secure",
      subtext: `Uptime: ${sessionDuration}`,
      icon: CheckCircle2,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
      border: "border-teal-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} border ${stat.border}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
