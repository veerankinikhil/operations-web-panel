"use client";

import React from "react";
import { FeatureType } from "@/types";
import {
  Wrench,
  RefreshCw,
  UserCheck,
  Sliders,
  HelpCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface FeatureCardProps {
  id: FeatureType;
  title: string;
  description: string;
  badge?: string;
  accent: "sky" | "indigo" | "emerald" | "amber" | "violet";
  onClick: (id: FeatureType) => void;
  isLoading?: boolean;
}

export function FeatureCard({
  id,
  title,
  description,
  badge,
  accent,
  onClick,
  isLoading,
}: FeatureCardProps) {
  const getIcon = () => {
    switch (id) {
      case "bind_tools":
        return Wrench;
      case "change_bind":
        return RefreshCw;
      case "account_status":
        return UserCheck;
      case "settings":
        return Sliders;
      case "help":
      default:
        return HelpCircle;
    }
  };

  const getAccentStyles = () => {
    switch (accent) {
      case "indigo":
        return {
          iconColor: "text-indigo-400",
          iconBg: "bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20",
          glow: "group-hover:shadow-indigo-500/10",
          btnColor: "bg-indigo-600 hover:bg-indigo-500 text-white",
        };
      case "emerald":
        return {
          iconColor: "text-emerald-400",
          iconBg: "bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20",
          glow: "group-hover:shadow-emerald-500/10",
          btnColor: "bg-emerald-600 hover:bg-emerald-500 text-white",
        };
      case "amber":
        return {
          iconColor: "text-amber-400",
          iconBg: "bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20",
          glow: "group-hover:shadow-amber-500/10",
          btnColor: "bg-amber-600 hover:bg-amber-500 text-white",
        };
      case "violet":
        return {
          iconColor: "text-violet-400",
          iconBg: "bg-violet-500/10 border-violet-500/20 group-hover:bg-violet-500/20",
          glow: "group-hover:shadow-violet-500/10",
          btnColor: "bg-violet-600 hover:bg-violet-500 text-white",
        };
      case "sky":
      default:
        return {
          iconColor: "text-sky-400",
          iconBg: "bg-sky-500/10 border-sky-500/20 group-hover:bg-sky-500/20",
          glow: "group-hover:shadow-sky-500/10",
          btnColor: "bg-sky-600 hover:bg-sky-500 text-white",
        };
    }
  };

  const Icon = getIcon();
  const styles = getAccentStyles();

  return (
    <div
      onClick={() => !isLoading && onClick(id)}
      className={`group relative p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-xl ${styles.glow} transform hover:-translate-y-0.5`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl border ${styles.iconBg} ${styles.iconColor} transition-all`}>
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-2">
          {title}
        </h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
          Execute Action
        </span>
        <button
          disabled={isLoading}
          className={`p-2 rounded-lg ${styles.btnColor} transition-transform active:scale-90 flex items-center justify-center`}
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}
