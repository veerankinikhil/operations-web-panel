"use client";

import React from "react";
import { BotStatus } from "@/types";
import { Bot, RefreshCw, ShieldCheck, Wifi, WifiOff, AlertTriangle } from "lucide-react";

interface NavbarProps {
  botUsername: string;
  status: BotStatus;
  latencyMs?: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Navbar({ botUsername, status, latencyMs, onRefresh, isRefreshing }: NavbarProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Connected {latencyMs ? `(${latencyMs}ms)` : ""}
          </span>
        );
      case "connecting":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Connecting...
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            Service Error
          </span>
        );
      case "disconnected":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <WifiOff className="w-3 h-3" />
            Disconnected
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand / Bot Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 ring-1 ring-white/10">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">
                Bot Operations Hub
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                v2.4 Web
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">@{botUsername}</p>
          </div>
        </div>

        {/* Right: Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            {getStatusBadge()}
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh bot status"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-sky-400" : ""}`} />
          </button>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Web Bridge</span>
          </div>
        </div>
      </div>
    </header>
  );
}
