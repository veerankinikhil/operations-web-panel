"use client";

import React, { useState } from "react";
import { FeatureType } from "@/types";
import {
  X,
  Wrench,
  RefreshCw,
  UserCheck,
  Sliders,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Send,
  Lock,
  Copy,
  Check,
} from "lucide-react";

interface ActionModalProps {
  feature: FeatureType | null;
  onClose: () => void;
  onSubmit: (feature: FeatureType, payload: Record<string, any>) => Promise<any>;
  isLoading: boolean;
}

export function ActionModal({ feature, onClose, onSubmit, isLoading }: ActionModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  if (!feature) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await onSubmit(feature, formData);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || "Failed to execute operation");
    }
  };

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFeatureMeta = () => {
    switch (feature) {
      case "bind_tools":
        return {
          title: "Bind Tools Configuration",
          icon: Wrench,
          description:
            "Register or link authorized automated tools to your Telegram bot session.",
        };
      case "change_bind":
        return {
          title: "Change Account / Device Bind",
          icon: RefreshCw,
          description:
            "Update your current registered device binding or account link securely.",
        };
      case "account_status":
        return {
          title: "Account & Bot Status Inspection",
          icon: UserCheck,
          description:
            "Query real-time bot authorization, user status, rate-limits, and active flags.",
        };
      case "settings":
        return {
          title: "Bot & Gateway Settings",
          icon: Sliders,
          description:
            "Configure notification thresholds, auto-refresh intervals, and security preferences.",
        };
      case "help":
      default:
        return {
          title: "Help & Bot Command Directory",
          icon: HelpCircle,
          description:
            "Quick command manual, troubleshooting guides, and API documentation.",
        };
    }
  };

  const meta = getFeatureMeta();
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md transition-all duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{meta.title}</h2>
              <p className="text-xs text-slate-400">{meta.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Operation Executed Successfully</span>
                </div>
                <button
                  type="button"
                  onClick={copyResult}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy JSON"}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono bg-slate-950/80 p-3 rounded-xl overflow-x-auto text-slate-300 border border-emerald-500/10 whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <form id="feature-form" onSubmit={handleFormSubmit} className="space-y-4">
            {feature === "bind_tools" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tool / Module Selection
                  </label>
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    onChange={(e) => handleChange("toolType", e.target.value)}
                    defaultValue="anti_ban_guard"
                  >
                    <option value="anti_ban_guard">Anti-Ban Guard Engine</option>
                    <option value="session_router">Session Router Proxy</option>
                    <option value="auto_responder">Auto Responder Dispatcher</option>
                    <option value="custom_bridge">Custom Webhook Bridge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Identifier / User Tag
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., USER_98432 or @channel"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    onChange={(e) => handleChange("targetId", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Execution Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Standard", "High Priority"].map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        onClick={() => handleChange("mode", mode.toLowerCase())}
                        className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                          formData.mode === mode.toLowerCase() ||
                          (!formData.mode && mode === "Standard")
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {feature === "change_bind" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Current Registered Bind Key / Account ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter existing binding reference"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    onChange={(e) => handleChange("currentBind", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Target Bind Key / Identifier
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new binding target identifier"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    onChange={(e) => handleChange("newBind", e.target.value)}
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    Validation handled server-side through authorized bot channel.
                  </span>
                </div>
              </>
            )}

            {feature === "account_status" && (
              <>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Click below to query live authorization quotas, rate-limits, and ban security status directly from the backend.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Optional Scope Filter
                  </label>
                  <input
                    type="text"
                    placeholder="All (Default) or specific user ID"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    onChange={(e) => handleChange("scope", e.target.value)}
                  />
                </div>
              </>
            )}

            {feature === "settings" && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-200">
                        Auto-Health Polling
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Check bot status every 20 seconds
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-sky-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700 cursor-pointer"
                      onChange={(e) => handleChange("autoPolling", e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-200">
                        Detailed Activity Logs
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Store and stream audit trails
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-sky-500 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700 cursor-pointer"
                      onChange={(e) => handleChange("detailedLogs", e.target.checked)}
                    />
                  </div>
                </div>
              </>
            )}

            {feature === "help" && (
              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-white text-xs uppercase tracking-wide">
                    Available Bot Web Features:
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    <li><strong className="text-slate-300">Bind Tools:</strong> Link modules and anti-ban safeguards.</li>
                    <li><strong className="text-slate-300">Change Bind:</strong> Seamlessly switch registration identifiers.</li>
                    <li><strong className="text-slate-300">Account Status:</strong> Live health & limits diagnostics.</li>
                    <li><strong className="text-slate-300">Settings:</strong> Real-time parameters and security safeguards.</li>
                  </ul>
                </div>
                <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
                  All requests communicate through your authorized backend proxy. Credentials remain 100% server-side.
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            type="submit"
            form="feature-form"
            disabled={isLoading}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Request</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
