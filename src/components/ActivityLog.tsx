"use client";

import React, { useState } from "react";
import { ActivityItem } from "@/types";
import {
  Terminal,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Trash2,
  Filter,
  Layers,
} from "lucide-react";

interface ActivityLogProps {
  logs: ActivityItem[];
  onClear: () => void;
}

export function ActivityLog({ logs, onClear }: ActivityLogProps) {
  const [filter, setFilter] = useState<"all" | "success" | "error" | "info">("all");

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    return log.status === filter;
  });

  const getStatusIcon = (status: ActivityItem["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case "error":
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case "pending":
        return <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />;
      case "info":
      default:
        return <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-hidden flex flex-col h-full shadow-xl">
      {/* Top Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Live Gateway Activity Log
            </h2>
            <p className="text-[11px] text-slate-400">
              Real-time audit records of all web-to-bot actions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
            {(["all", "success", "error", "info"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  filter === tab
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {logs.length > 0 && (
            <button
              onClick={onClear}
              title="Clear log"
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 hover:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Log Entries Container */}
      <div className="p-4 overflow-y-auto space-y-2.5 max-h-96 font-mono text-xs scrollbar-thin">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mx-auto text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-slate-300 font-medium text-sm">
              {filter === "all"
                ? "No gateway activity logged yet"
                : `No events matching filter: ${filter}`}
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Execute any operation from the feature cards above to trigger automated telemetry and audit tracking.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/70 flex items-start gap-3 hover:border-slate-700/90 transition-all hover:bg-slate-950"
            >
              <div className="mt-0.5">{getStatusIcon(log.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sky-400 uppercase tracking-wider text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 mt-1 text-xs break-words">{log.message}</p>
                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800/60 text-[11px] text-slate-400 overflow-x-auto">
                    <pre className="whitespace-pre-wrap break-all">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
