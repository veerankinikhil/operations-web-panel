"use client";

import React, { useState } from "react";
import {
  Zap,
  Coins,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  X,
  Key,
  Shield,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  Lock,
} from "lucide-react";

type ModeType = "30_days" | "7_days" | "permanent" | null;

interface AuditLog {
  id: string;
  time: string;
  mode: string;
  uid: string;
  server: string;
  status: "SUCCESS" | "FAILED";
  ticket: string;
}

export default function ControlPanel() {
  const [selectedMode, setSelectedMode] = useState<ModeType>(null);
  const [uid, setUid] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [executionKey, setExecutionKey] = useState<string>("");
  const [server, setServer] = useState<"india" | "other">("india");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const handleOpenMode = (mode: "30_days" | "7_days" | "permanent") => {
    setSelectedMode(mode);
    setErrorMsg(null);
    setSuccessResult(null);
    if (mode !== "7_days") {
      setServer("india");
    }
  };

  const handleSubmitAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMode) return;
    setErrorMsg(null);
    setSuccessResult(null);

    if (!accessToken.trim()) {
      setErrorMsg("Please enter the Access Token");
      return;
    }

    if (!executionKey.trim()) {
      setErrorMsg("Please enter the Execution Key (SAMBA-MG-NENU)");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/telegram/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: selectedMode,
          payload: {
            uid: uid.trim(),
            accessToken: accessToken.trim(),
            key: executionKey.trim(),
            server,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Operation failed");
      }

      setSuccessResult(data.result);
      const newLog: AuditLog = {
        id: data.result.actionId,
        time: new Date().toLocaleTimeString(),
        mode: selectedMode.toUpperCase().replace("_", " "),
        uid: uid.trim(),
        server: server === "india" ? "🇮🇳 India" : "🌐 Other",
        status: "SUCCESS",
        ticket: data.result.actionId,
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30">
      {/* Top Header */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-sm text-emerald-400">
                ⚡️
              </div>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                Operations Web Panel
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
                  PRO
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">Real-time Execution Bridge</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Online Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column / Control Panel */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <div className="w-full max-w-md lg:max-w-none bg-[#0f172a]/95 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Top Bar */}
            <div className="bg-[#1e293b]/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                Control Hub
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Direct Execution
              </span>
            </div>

            {/* Panel Body */}
            <div className="p-4 sm:p-6 space-y-5">
              {/* Graphic Banner */}
              <div className="rounded-2xl bg-black border border-slate-800 overflow-hidden shadow-xl relative">
                <div className="p-6 bg-gradient-to-b from-neutral-900 via-black to-neutral-950 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"></div>

                  <div className="flex items-center justify-center gap-1 mb-2 opacity-80">
                    <span className="text-[10px] tracking-widest text-slate-400">▶▶▶▶▶▶▶▶</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-widest font-mono">
                    WELCOME
                  </h2>

                  <div className="flex items-center justify-center gap-1 mt-2 opacity-80">
                    <span className="text-[10px] tracking-widest text-slate-400">◀◀◀◀◀◀◀◀</span>
                  </div>

                  <div className="w-full mt-4 flex items-center justify-between border-t border-dashed border-slate-800 pt-2 text-[10px] text-slate-500 font-mono">
                    <span>+</span>
                    <span>CONTROL PANEL v3.0</span>
                    <span>+</span>
                  </div>
                </div>

                {/* Announcement Body */}
                <div className="p-4 sm:p-5 space-y-3 bg-[#0b1329] text-xs text-slate-300">
                  <div className="text-center font-bold text-amber-400 text-xs sm:text-sm tracking-wide flex items-center justify-center gap-1">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>PREMIUM CONTROL PANEL</span>
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>System Active &amp; Verified.</span>
                  </div>

                  <div className="text-slate-300 font-medium">
                    👇 Select your required option:
                  </div>

                  <div className="space-y-1.5 pl-1 font-mono text-[11px] sm:text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">🔴</span>
                      <span>Select 30 Days Mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">🟢</span>
                      <span>Select 7 Days Mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">⚫️</span>
                      <span>Select Permanent Mode</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>🇮🇳 India Server</span>
                      </div>
                      <div className="text-slate-400 pl-3 font-mono mt-0.5">↳ 30 Days + Permanent</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>🌐 Other Servers</span>
                      </div>
                      <div className="text-slate-400 pl-3 font-mono mt-0.5">↳ 7 Days Only</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleOpenMode("30_days")}
                    className="py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-900/70 to-teal-900/70 hover:from-emerald-800 hover:to-teal-800 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>⚡️ 30 Thirty Days</span>
                  </button>

                  <button
                    onClick={() => handleOpenMode("7_days")}
                    className="py-4 px-4 rounded-2xl bg-gradient-to-r from-teal-900/70 to-cyan-900/70 hover:from-teal-800 hover:to-cyan-800 border border-teal-500/40 text-teal-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>🪙 7 Days</span>
                  </button>
                </div>

                <button
                  onClick={() => handleOpenMode("permanent")}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900 hover:from-slate-800 hover:to-slate-800 border border-red-500/40 text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>🔴 Permanent Mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Feed & Telemetry */}
        <div className="lg:col-span-5 space-y-5 w-full">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Core Status</span>
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-white">Active v3.0</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">TLS 1.3 Guarded</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
                <span>Dispatched</span>
                <Layers className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-lg font-bold text-white">{logs.length} Actions</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Real-time Stream</div>
            </div>
          </div>

          {/* Dispatch Feed Card */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Dispatch Feed
                </h3>
              </div>
              {logs.length > 0 && (
                <button
                  onClick={() => setLogs([])}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear Feed
                </button>
              )}
            </div>

            <div className="p-3 sm:p-4 space-y-2 max-h-80 sm:max-h-96 overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs italic space-y-2">
                  <Terminal className="w-6 h-6 mx-auto opacity-40" />
                  <p>No dispatches executed yet.</p>
                  <p className="text-[11px] text-slate-600">
                    Click 30 Days, 7 Days, or Permanent Mode to launch a request.
                  </p>
                </div>
              ) : (
                logs.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col gap-1 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{item.mode}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-sans">{item.time}</span>
                    </div>
                    <div className="text-slate-300 text-xs flex items-center justify-between">
                      <span>UID: {item.uid}</span>
                      <span className="text-slate-400 text-[11px]">{item.server}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Ticket: {item.ticket}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Action Execution Modal with BOTH Access Token & Execution Key columns */}
      {selectedMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {selectedMode === "30_days"
                      ? "⚡️ 30 Days Mode"
                      : selectedMode === "7_days"
                      ? "🪙 7 Days Mode"
                      : "🔴 Permanent Mode"}
                  </h3>
                  <p className="text-[11px] text-slate-400">Execution Request</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Request Executed Successfully</span>
                  </div>
                  <button
                    onClick={() => handleCopy(JSON.stringify(successResult, null, 2))}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-md"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-emerald-500/10 space-y-1">
                  <div><strong>Ticket:</strong> {successResult.actionId}</div>
                  <div><strong>Target UID:</strong> {successResult.uid}</div>
                  <div><strong>Server:</strong> {successResult.server}</div>
                  <div><strong>Status:</strong> {successResult.status}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitAction} className="space-y-3.5">
              {/* Column 1: Player UID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Player UID / Game ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1948204918"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Column 2: Access Token */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Access Token
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter Access Token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <Key className="w-4 h-4 text-sky-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Column 3: Execution Key */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Execution Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter Execution Key"
                    value={executionKey}
                    onChange={(e) => setExecutionKey(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Column 4: Server Region */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Server Region
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setServer("india")}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                      server === "india"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    🇮🇳 India Server
                  </button>
                  <button
                    type="button"
                    onClick={() => setServer("other")}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                      server === "other"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                        : "bg-slate-950 text-slate-400 border-slate-800"
                    }`}
                  >
                    🌐 Other Servers
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMode(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Execute Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/60 py-4 text-center text-xs text-slate-500 font-mono">
        Operations Web Panel • Desktop &amp; Mobile Responsive
      </footer>
    </div>
  );
}
